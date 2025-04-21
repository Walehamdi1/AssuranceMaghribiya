import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-create-devis-habitation',
  templateUrl: './create-devis-habitation.component.html',
  styleUrls: ['./create-devis-habitation.component.css']
})
export class CreateDevisHabitationComponent {


createDevisForm: FormGroup;
  captchaValid = false;
  siteKey: string = environment.recaptchaSiteKey;
  selectedContract?: any;

  constructor(
    private formBuilder: FormBuilder,
    private devisService: DevisService,
    private router: Router,
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.createDevisForm = this.formBuilder.group({
      nomClient: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Za-z]+$')]],
      emailClient: ['', [Validators.required, Validators.email]],
      dateDebut: [today, [Validators.required, this.dateValidator]],
      dateFin: ['', [Validators.required,]],
   adresse: [
    '',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^(?=.*[A-Za-zÀ-ÿ])(?=.*[0-9])[A-Za-zÀ-ÿ0-9,\\s-]+$') 
    ]
  ],
  surface: ['', [Validators.required, Validators.min(10)]],
  montantTotal: ['', [Validators.required, Validators.min(1000)]],
     
      typeAssurance: ['HABITATION', Validators.required],
      statut: ['EN_ATTENTE', Validators.required]
    }, { validators: [this.endDateValidator] });
  }


  ngOnInit(): void { }
  endDateValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('dateDebut')?.value;
    const endDate = group.get('dateFin')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if endDate is before or equal to startDate
      if (end <= start) {
        return { endDateInvalid: 'End date must be after start date' };
      }
    }
    return null;
  }

  

  createDevis(): void {
    if (this.createDevisForm.valid) {
      const formData = {
        ...this.createDevisForm.value,
        statut: this.createDevisForm.value.statut || 'EN_ATTENTE',
        typeAssurance: this.createDevisForm.value.typeAssurance || 'HABITATION',
      };

      this.devisService.createDevisHabitation(formData).subscribe(
        (response) => {
          console.log('Devis  créé avec succès', response);
          this.router.navigate(['/devisList']);
        },
        (error) => {
          console.error('Erreur lors de la création du devis:', error);
        }
      );
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }



  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date().toISOString().split('T')[0];
    if (control.value < today) {
      return { dateDebutInvalid: 'Start date cannot be earlier than today' };
    }
    return null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.createDevisForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  captchaResolved(response: string) {
    if (response) {
      this.captchaValid = true;
    }
  }

}
