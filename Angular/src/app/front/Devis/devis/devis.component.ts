import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { Devis } from 'src/app/models/Devis.model';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent {
  nationalites: string[] = [
    'Afghan', 'Albanian', 'Algerian', 'Andorran', 'Angolan', 'Antiguans', 'Argentine', 'Armenian', 'Australian',
    'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean',
    'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinese',
    'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian',
    'Chilean', 'Chinese', 'Colombian', 'Comorian', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot',
    'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dominican Republic', 'Dutch', 'East Timorese', 'Ecuadorean',
    'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish',
    'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greece', 'Grenadian', 'Guatemalan',
    'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelander', 'Indian', 'Indonesian',
    'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani',
    'Kenyan', 'Kittian and Nevisian', 'Kosovar', 'Kuwaiti', 'Kyrgyzstani', 'Laotian', 'Latvian', 'Lebanese', 'Lesotho',
    'Liberian', 'Libyan', 'Liechtenstein', 'Lithuanian', 'Luxembourg', 'Macanese', 'Macedonian', 'Malagasy',
    'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican',
    'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Montenegrin', 'Moroccan', 'Mozambican', 'Namibian',
    'Nauruan', 'Nepalese', 'New Zealand', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Norwegian', 'Omani',
    'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Philippine', 'Polish',
    'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Kitts and Nevis', 'Saint Lucian', 'Salvadoran',
    'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi Arabian', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean',
    'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish',
    'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian',
    'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Turkmen', 'Tuvaluan', 'Ugandan',
    'Ukrainian', 'Uruguayan', 'Uzbek', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemeni', 'Zambian', 'Zimbabwean'
  ];

  devisList: any[] = [];
  base64Image: string = '';
  captchaValid = false;
  siteKey: string = environment.recaptchaSiteKey;

  firstFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private devisService: DevisService,
    private router: Router,
  ) {
    // Initialize the form group with validation
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    this.firstFormGroup = this.formBuilder.group({
      nomClient: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Za-z]+$')]],
      emailClient: ['', [Validators.required, Validators.email]],
      dateDebut: [today, [Validators.required, this.dateValidator]],
      dateFin: ['', [Validators.required,]],
      trancheAge: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      nationalite: ['', Validators.required],
      destination: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-zÀ-ÿ\\s]+$')]],
      typeAssurance: ['VOYAGE', Validators.required],
      statut: ['EN_ATTENTE', Validators.required]
    }, { validators: [this.endDateValidator] });
  }

  ngOnInit(): void { }
  // Custom validation to ensure end date is after start date
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
  captchaResolved(response: string) {
    if (response) {
      this.captchaValid = true;
    }
  }


  // Custom validation for dateDebut to ensure it is not earlier than today
  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date().toISOString().split('T')[0];
    if (control.value < today) {
      return { dateDebutInvalid: 'Start date cannot be earlier than today' };
    }
    return null;
  }
  createDevis(): void {
    if (this.firstFormGroup.valid) {
      // Récupération des données du formulaire
      const formData = {
        ...this.firstFormGroup.value,
        statut: this.firstFormGroup.value.statut || 'EN_ATTENTE',
        typeAssurance: this.firstFormGroup.value.typeAssurance || 'VOYAGE',
      };

      this.devisService.createDevis(formData).subscribe(
        (response) => {
          console.log('Devis créé avec succès', response);
          this.router.navigate(['devisList']);
        },
        (error) => {
          console.error('Erreur lors de la création du devis:', error);
        }
      );
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }



  isFieldInvalid(field: string): boolean {
    const control = this.firstFormGroup.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
}
