import { Component, OnInit } from '@angular/core';
import { Expert } from 'src/app/models/expert.model';
import { ExpertService } from 'src/app/services/expert.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-profile',
  templateUrl: './expert-profile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, ButtonModule, ToastModule],
  styleUrls: ['./expert-profile.component.css']
})
export class ExpertProfileComponent implements OnInit {
  expert: Expert = {
    id: 1,
    email: '',
    nom: '',
    prenom: '',
    specialite: 'maison',  // Valeur par défaut pour éviter le problème avec p-dropdown
    rating: 0
  };

  specialiteOptions = [
    { label: 'Maison', value: 'maison' },
    { label: 'Voiture', value: 'voiture' },
    { label: 'Santé', value: 'sante' }
  ];
  
  submitted = false;

  constructor(
    private expertService: ExpertService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadExpert();
    if (!this.expert.specialite || !this.specialiteOptions.some(option => option.value === this.expert.specialite)) {
      this.expert.specialite = this.specialiteOptions[0].value;
    }
  }

  loadExpert(): void {
    if (this.expert.id !== undefined) {
      this.expertService.getExpertById(this.expert.id).subscribe(
        (data: Expert) => {
          this.expert = data;
        },
        (error: any) => {
          console.error('Erreur de récupération de l\'expert', error);
        }
      );
    }
  }

  updateExpert(): void {
    this.submitted = true;
    if (this.isFormValid()) {
      if (this.expert.id !== undefined) {
        this.expertService.updateExpert(this.expert.id, this.expert).subscribe(
          updated => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour.' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour échouée.' });
          }
        );
      } else {
        console.error('ID de l\'expert est indéfini');
      }
    }
  }

  emailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(this.expert.email);
  }

  isFormValid(): boolean {
    return !!(this.expert.nom && this.expert.prenom && this.emailValid() && this.expert.specialite);
  }
}
