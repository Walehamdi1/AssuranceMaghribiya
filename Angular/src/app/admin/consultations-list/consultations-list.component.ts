import { Component, OnInit } from '@angular/core';
import { ConsultationService } from 'src/app/services/consulting.service';
import { Consultation } from 'src/app/models/consulting.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { NgxPaginationModule } from 'ngx-pagination';
import { Expert } from 'src/app/models/expert.model';
import { ExpertService } from 'src/app/services/expert.service';
import { Router } from '@angular/router';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { EmailService } from 'src/app/services/EmailService';


@Component({
  selector: 'app-consultations-list',
  templateUrl: './consultations-list.component.html',
  styleUrls: ['./consultations-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, NgChartsModule]
})
export class ConsultationsListComponent implements OnInit {
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  filterSpeciality: string = '';
  showExperts: boolean = false;
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedExpert: Expert | null = null;
  selectedConsultation: Consultation | null = null;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  filterCriteria = {
    statut: '',
    dateConsultation: ''
  };

  notificationMessage: string = '';
  notificationType: string = '';
  page: number = 1;
  pageSize: number = 10;
  showStatistics: boolean = false;
  statistics = { maison: 0, voiture: 0, sante: 0 };

  barChartOptions: ChartOptions = { responsive: true };
  barChartData: ChartDataset<'bar'>[] = [{ data: [0, 0, 0], label: 'Nombre de consultations' }];
  barChartLabels: string[] = ['Maison', 'Voiture', 'Santé'];
  barChartLegend = true;
  barChartType: ChartType = 'bar';

  constructor(
    private consultationService: ConsultationService,
    private emailService: EmailService,
    private expertService: ExpertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
    this.loadExperts();
  }

  loadExperts(): void {
    this.expertService.getAllExperts().subscribe(
      (data: Expert[]) => {
        this.experts = data;
        this.filteredExperts = [...this.experts];
      },
      (error) => {
        console.error('Erreur lors du chargement des experts:', error);
      }
    );
  }

  applyExpertFilter(): void {
    this.filteredExperts = this.experts.filter(expert =>
      !this.filterSpeciality || expert.specialite.toLowerCase().includes(this.filterSpeciality.toLowerCase())
    );
  }

  assignExpert(selectedConsultation: Consultation, expert: Expert): void {
    if (selectedConsultation.id && expert.id) {
      this.consultationService.assignExpertToConsultation(selectedConsultation.id, expert.id)
        .subscribe(updatedConsultation => {
          this.selectedConsultation = null;
          this.selectedExpert = null;
          this.loadConsultations();
          
          // Envoi de l'email de confirmation après l'assignation
          this.sendConsultationEmail(updatedConsultation); // Appel au service d'envoi d'email

          this.showNotification('Expert assigné avec succès.', 'success');
        }, error => {
          console.error('Erreur lors de l’affectation de l’expert', error);
          this.showNotification('Erreur lors de l’affectation de l’expert.', 'error');
        });
    } else {
      console.error('Consultation ou expert invalide');
    }
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe(data => {
      const previousConsultations = this.filteredConsultations ? [...this.filteredConsultations] : [];
      this.consultations = data;
      this.filteredConsultations = [...this.consultations];
      this.calculateWeeklyStatistics();

      this.filteredConsultations.sort((a, b) => (a.statut === 'EN_COURS' ? -1 : b.statut === 'EN_COURS' ? 1 : 0));

      const newConsultations = this.consultations.filter(consultation => 
        !previousConsultations.some(prevConsultation => prevConsultation.id === consultation.id)
      );

      if (newConsultations.length > 0) {
        this.showNotification('De nouvelles consultations ont été ajoutées.', 'success');
      }

      this.consultationService.getConsultationStatistics().subscribe(stats => {
        this.statistics = stats;
        this.updateChartData();
      });
    });
  }

  getStartOfWeek(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  calculateWeeklyStatistics(): void {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
  
    const weeklyConsultations = this.consultations.filter(consultation => {
      const consultationDate = new Date(consultation.dateConsultation);
      return consultationDate >= startOfWeek && consultationDate <= endOfWeek;
    });
  
    // Ajout de la journalisation pour vérifier les consultations de la semaine
    console.log('Consultations de cette semaine:', weeklyConsultations);
  
    // Calcul des statistiques par type d'assurance
    this.statistics = {
      maison: weeklyConsultations.filter(c => c.insuranceType === 'maison').length,
      voiture: weeklyConsultations.filter(c => c.insuranceType === 'voiture').length,
      sante: weeklyConsultations.filter(c => c.insuranceType === 'sante').length
    };
  
    this.updateChartData();
  }
  
  // openedDropdownId: number | null = null;

// toggleDropdown(id): void {
//   this.openedDropdownId = this.openedDropdownId === id ? null : id;
// }

  
  
  

  updateChartData(): void {
    this.barChartData = [{
      data: [this.statistics.maison, this.statistics.voiture, this.statistics.sante],
      label: 'Nombre de consultations'
    }];
  
    if (this.chart) {
      this.chart.update();
    }
  }
  
  applyFilters(): void {
    this.filteredConsultations = this.consultations.filter(consultation => {
      const statutMatch = !this.filterCriteria.statut || consultation.statut === this.filterCriteria.statut;
      const dateMatch = !this.filterCriteria.dateConsultation || 
        new Date(consultation.dateConsultation).toISOString().split('T')[0] === this.filterCriteria.dateConsultation;
      return statutMatch && dateMatch;
    });
  
    console.log('Filtered consultations:', this.filteredConsultations);
  
    this.calculateStatistics();
    this.notificationMessage = this.filteredConsultations.length === 0
      ? 'Aucune consultation trouvée pour les critères de filtrage.'
      : '';
  }
  

  calculateStatistics(): void {
    this.statistics = { maison: 0, voiture: 0, sante: 0 };
  
    this.filteredConsultations.forEach(consultation => {
      switch (consultation.insuranceType) {
        case 'Maison':
          this.statistics.maison++;
          break;
        case 'Voiture':
          this.statistics.voiture++;
          break;
        case 'Santé':
          this.statistics.sante++;
          break;
      }
    });
  
    this.updateChartData();
  }
  
  toggleStatistics() {
    this.showStatistics = !this.showStatistics;
  }

  acceptConsultation(id: number): void {
    // Vérification si l'ID est valide
    const consultationId = id;  // Utilise directement l'ID passé au lieu de selectedConsultation?.id
    if (consultationId) {
      this.consultationService.updateStatut(consultationId, 'EN_COURS').subscribe(
        (consultation) => {
          this.loadConsultations();
          this.notificationMessage = 'Consultation acceptée';
          this.notificationType = 'success';
          this.selectedConsultation = consultation;
          this.selectedExpert = null;
          this.showExperts = true;
          this.router.navigate(['admin/assignexpert', consultationId]);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
          this.notificationMessage = 'Erreur lors de l\'acceptation de la consultation';
          this.notificationType = 'error';
        }
      );
    } else {
      console.error('Consultation ID invalide');
    }
  }

  rejectConsultation(id: number): void {
    this.consultationService.updateStatut(id, 'REJETÉE').subscribe(consultation => {
      if (consultation) {
        // Appeler la méthode correcte pour envoyer l'email
        this.emailService.sendConsultationEmail(consultation, 'rejected').subscribe({
          next: () => {
            console.log('Email rejet envoyé');
            this.loadConsultations();
          },
          error: () => {
            console.log('Erreur lors de l\'envoi de l\'email');
          }
        });
      }
    });
  }

  selectConsultation(consultation: Consultation): void {
    this.selectedConsultation = consultation;
  }

  sendConsultationEmail(consultation: Consultation): void {
    this.emailService.sendConsultationEmail(consultation, 'assigned').subscribe({
        next: () => {
            this.notificationMessage = 'Email envoyé avec succès.';
            this.notificationType = 'success';
            setTimeout(() => this.notificationMessage = '', 3000);
        },
        error: () => {
            this.notificationMessage = 'Erreur lors de l\'envoi de l\'email.';
            this.notificationType = 'error';
            setTimeout(() => this.notificationMessage = '', 3000);
        }
    });
}


  deleteConsultation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id).subscribe(() => {
        this.loadConsultations();
        this.notificationMessage = 'Consultation supprimée.';
        this.notificationType = 'success';
      }, () => {
        this.notificationMessage = 'Erreur lors de la suppression de la consultation.';
        this.notificationType = 'error';
      });
    }
  }

  exportToPDF(consultation: Consultation): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Détails de la Consultation', 20, 20);
  
    // Informations de la consultation
    doc.setFontSize(12);
    doc.text(`ID: ${consultation.id}`, 20, 30);
    doc.text(`Objet: ${consultation.objet}`, 20, 40);
    doc.text(`Description: ${consultation.description}`, 20, 50);
    doc.text(`Date de Consultation: ${consultation.dateConsultation}`, 20, 60);
    doc.text(`Statut: ${consultation.statut || 'Non défini'}`, 20, 70);
    doc.text(`Type d'Assurance: ${consultation.insuranceType}`, 20, 80);
    doc.text(`Note: ${consultation.rating || 'Non notée'}`, 20, 90); 
    doc.text(`Commentaire: ${consultation.comment || 'Aucun commentaire'}`, 20, 100);
  
    
    
    
    
    doc.save('consultation-details.pdf');
  }
  
  

  showNotification(message: string, type: string): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => this.notificationMessage = '', 5000);
  }

  onPageChange(page: number): void {
    this.page = page;
  }
}
