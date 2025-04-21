import { Component, OnInit } from '@angular/core';
import { ExpertService } from 'src/app/services/expert.service';
import { Expert } from 'src/app/models/expert.model';
import { Consultation } from 'src/app/models/consulting.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultationService } from 'src/app/services/consulting.service';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ToastrService } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-expert-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SliderModule, RatingModule,ToastModule],
  templateUrl: './expert-list.component.html',
  styleUrls: ['./expert-list.component.css']
})
export class ExpertListComponent implements OnInit {
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  specialties: { label: string, value: string }[] = [];
  selectedSpecialty: string | null = null;
  ratingFilter: number = 0;
  showAddExpertForm: boolean = false;
  newExpert: Expert = { id: undefined, nom: '', prenom: '', email: '', specialite: '', rating: 0 };
  selectedConsultation: Consultation | null = null;
  consultationId: number = 0;

  constructor(
    private expertService: ExpertService,
    private route: ActivatedRoute,
    private consultationService: ConsultationService,
    private router: Router,
    private toastr: ToastrService,
    private messageService: MessageService  
  ) {}

  ngOnInit(): void {
    this.loadExperts();
    this.consultationId = +this.route.snapshot.paramMap.get('consultationId')!;
    if (this.consultationId) {
      this.consultationService.getConsultationById(this.consultationId).subscribe(
        consultation => {
          this.selectedConsultation = consultation;
        },
        error => {
          console.error('Erreur lors de la récupération de la consultation', error);
        }
      );
    } else {
      console.error('Consultation ID invalide');
    }
  }

  loadExperts(): void {
    this.expertService.getAllExperts().subscribe(
      (data: Expert[]) => {
        this.experts = data;
        this.filteredExperts = [...this.experts];
        // Extraire les spécialités uniques
        this.specialties = Array.from(new Set(data.map(expert => expert.specialite)))
          .map(specialite => ({ label: specialite, value: specialite }));
      },
      (error: any) => {
        console.error('Erreur lors du chargement des experts:', error);
      }
    );
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredExperts = this.experts.filter(expert => {
      const matchesSpecialty = this.selectedSpecialty ? expert.specialite === this.selectedSpecialty : true;
      const matchesRating = expert.rating >= this.ratingFilter;
      return matchesSpecialty && matchesRating;
    });
    this.filteredExperts.sort((a, b) => b.rating - a.rating);
  }

  // Ajouter un nouvel expert
  addExpert(): void {
    if (this.newExpert.nom && this.newExpert.prenom && this.newExpert.email && this.newExpert.specialite) {
      this.expertService.addExpert(this.newExpert).subscribe(
        (data) => {
          this.experts.unshift(data);
          this.showAddExpertForm = false;
          this.newExpert = { id: 0, nom: '', prenom: '', email: '', specialite: '', rating: 0 };
          this.applyFilters();  // Appliquer les filtres après ajout
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'expert:', error);
        }
      );
    }
  }

  // Affecter un expert à une consultation
  assignExpertToConsultation(selectedConsultation: Consultation | null, expert: Expert): void {
    if (selectedConsultation && selectedConsultation.id && expert?.id) {
      console.log(`Affectation en cours : Expert ${expert.nom} -> Consultation ${selectedConsultation.id}`);
      this.consultationService.assignExpertToConsultation(selectedConsultation.id, expert.id)
        .subscribe(
          (updatedConsultation) => {
            if (updatedConsultation.id) {
              updatedConsultation.statut = 'VALIDÉE';
              this.consultationService.updateStatut(updatedConsultation.id, updatedConsultation.statut).subscribe(
                () => {
                  console.log("✅ Consultation mise à jour avec succès !");
                  this.toastr.success("brqvo","bbbb",{ timeOut: 3000 });
                  this.router.navigate(['/admin/consultations']);
                },
                (error) => {
                  this.toastr.error("error");
                  console.error('Erreur lors de la mise à jour du statut de la consultation', error);
                }
              );
            }
          },
          (error) => {
            this.toastr.error("error","oooooo",{ timeOut: 3000 });
            console.error('Erreur lors de l\'affectation de l\'expert', error);
          }
        );
    }
    this.messageService.add({ severity: 'success', summary: 'Expert assigné', detail: `L'expert ${expert.nom} a été assigné.` });

  }

  // Supprimer un expert
  deleteExpert(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet expert ?')) {
      this.expertService.deleteExpert(id).subscribe(
        () => {
          this.experts = this.experts.filter(expert => expert.id !== id);
          this.applyFilters();  // Appliquer les filtres après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'expert:', error);
        }
      );
    }
  }
}
