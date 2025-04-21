import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../services/consulting.service';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-consulting-list',
  standalone: true,
  imports: [CommonModule, FormsModule,TableModule,ButtonModule, TagModule,MessageModule],
  templateUrl: './consulting-list.component.html',
  styleUrls: ['./consulting-list.component.css']
})
export class ConsultingListComponent implements OnInit {
  consultations: any[] = [];
  clientId: number = 1;
  showPlatformOptions: boolean = false;
  selectedPlatform: string | null = null;
  isDarkMode: boolean = false; 

  constructor(
    private consultationService: ConsultationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadConsultations();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = prefersDark;
  }

  // Chargement des consultations
  loadConsultations() {
    this.consultationService.getAllConsultations().subscribe({
      next: data => {
        console.log('Réponse de l\'API:', data);
        this.consultations = data;
        console.log('Consultations filtrées:', this.consultations);
      },
      error: err => {
        console.error('Erreur lors de la récupération des consultations', err);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    });
  }

  // Export d'une consultation en PDF
  exportToPDF(consultation: any) {
    const doc = new jsPDF();
    doc.text(`Consultation ID: ${consultation.id}`, 10, 10);
    doc.text(`Client ID: ${consultation.clientId}`, 10, 20);
    doc.text(`Date de Consultation: ${consultation.dateConsultation}`, 10, 30);
    doc.text(`Type de Consultation: ${consultation.typeConsultation}`, 10, 40);
    if (consultation.status) {
      doc.text(`Statut: ${consultation.status}`, 10, 50);
    }
    doc.save(`consultation_${consultation.id}.pdf`);
  }

  // Affiche les options de plateformes pour la consultation en ligne
  showOnlineConsultationOptions(consultation: any) {
    this.showPlatformOptions = true;
    console.log('Options de consultation en ligne affichées pour:', consultation);
  }

  // Demande une consultation en ligne
  requestOnlineConsultation(consultation: any) {
    console.log('Demande de consultation en ligne pour:', consultation);
    // Logique supplémentaire à implémenter ici
  }

  // Suppression d'une consultation
  deleteConsultation(consultationId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(consultationId).subscribe({
        next: () => {
          console.log(`Consultation ${consultationId} supprimée`);
          this.consultations = this.consultations.filter(c => c.id !== consultationId);
        },
        error: err => {
          console.error('Erreur lors de la suppression de la consultation', err);
          alert('Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }
  getStatutSeverity(statut: string): string {
    switch (statut) {
      case 'EN_COURS':
        return 'warning';
      case 'VALIDÉE':
        return 'success';
      case 'REJETÉE':
        return 'danger';
      default:
        return 'info';
    }
  }
}
