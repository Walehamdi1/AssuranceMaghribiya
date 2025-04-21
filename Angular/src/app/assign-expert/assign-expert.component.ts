import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpertService } from '../services/expert.service';
import { ConsultationService } from '../services/consulting.service';
import { Expert } from 'src/app/models/expert.model';
import { Consultation } from '../models/consulting.model'; 

@Component({
  selector: 'app-assign-expert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-expert.component.html',
  styleUrls: ['./assign-expert.component.css']
})
export class AssignExpertComponent {
  consultationId: number | undefined;
  showAddExpertForm = false;
  newExpert: Expert = { id: undefined, nom: '', prenom: '', email: '', specialite: '', rating: 0 };
  experts: Expert[] = [];

  constructor(private expertService: ExpertService, private consultationService: ConsultationService) {}

  ngOnInit(): void {
    this.loadExperts();
  }

  // Charger les experts depuis le service
  loadExperts(): void {
    this.expertService.getAllExperts().subscribe(
      (data: Expert[]) => {
        console.log(data);  // Affichez la réponse dans la console
        this.experts = data;
        // Trier les experts en fonction de leur note, du plus élevé au plus bas
        this.experts.sort((a, b) => b.rating - a.rating); 
      },
      (error: any) => {
        console.error('Erreur lors du chargement des experts:', error);
      }
    );
  }

  // Ajouter un nouvel expert
  addExpert(): void {
    console.log('Données envoyées:', this.newExpert);

    if (this.newExpert.nom && this.newExpert.prenom && this.newExpert.email && this.newExpert.specialite) {
      // Envoi de l'expert sans l'ID (le backend le générera)
      this.newExpert.id = undefined;
      this.newExpert.rating = 0;
      this.expertService.addExpert(this.newExpert).subscribe(
        (data) => {
          console.log('Expert ajouté:', data);
          this.experts.unshift(data);  // Ajouter le nouvel expert en haut de la liste
          this.showAddExpertForm = false;  // Fermer le formulaire d'ajout
          // Réinitialiser les champs du formulaire
          this.newExpert = { id: undefined, nom: '', prenom: '', email: '', specialite: '', rating: 0 };
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'expert:', error);
        }
      );
    } else {
      console.error('Les champs du formulaire sont incomplets.');
    }
  }

  // Supprimer un expert
  deleteExpert(id: number): void {
    console.log('Supprimer expert avec ID:', id);
    this.expertService.deleteExpert(id).subscribe(
      () => {
        // Supprimer l'expert du tableau après succès
        this.experts = this.experts.filter(expert => expert.id !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'expert:', error);
      }
    );
  }

  // Affecter un expert à une consultation
  assignExpert(consultation: Consultation, expert: Expert): void {
    // Vérifier si consultation.id et expert.id sont valides et sont des nombres
    if (consultation && expert && typeof consultation.id === 'number' && typeof expert.id === 'number') {
      this.consultationService.assignExpertToConsultation(consultation.id, expert.id).subscribe(
        (updatedConsultation: Consultation) => {
          console.log('Consultation mise à jour avec expert et statut changé:', updatedConsultation);
          consultation.statut = 'VALIDÉE'; 
          consultation.expertId = expert.id; // Affecter l'expert à la consultation
        },
        (error) => {
          console.error('Erreur lors de l\'affectation de l\'expert à la consultation:', error);
        }
      );
    } else {
      console.error('L\'ID de la consultation ou de l\'expert est invalide ou non défini');
    }
  }
}
