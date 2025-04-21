import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultationService } from '../../services/consulting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulting-form',
  templateUrl: './consulting-form.component.html',
  styleUrls: ['./consulting-form.component.css']
})
export class ConsultingFormComponent implements OnInit {
  consultationForm!: FormGroup;
  defaultClientId: number = 1; // ID du client par défaut

  constructor(
    private fb: FormBuilder,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      clientId: [this.defaultClientId, Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.consultationForm.valid) {
      const formData = {
        ...this.consultationForm.value,
        date: new Date(this.consultationForm.value.date).toISOString() // Format ISO
      };

      this.consultationService.createConsultation(formData).subscribe({
        next: (response) => {
          console.log('Consultation enregistrée avec succès !', response);
          alert('Consultation créée avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde de la consultation:', err);
          alert('Une erreur est survenue.');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }
}
