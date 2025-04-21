import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../services/consulting.service';
import { Consultation } from '../models/consulting.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-expert-consultations',
  templateUrl: './expert-consultations.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    CalendarModule,
    TableModule,
    DialogModule,
    RatingModule
  ],
  styleUrls: ['./expert-consultations.component.css']
})
export class ExpertConsultationsComponent implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultations: Consultation[] = [];
  selectedWeek: Date[] = [];
  notificationMessage: string = '';
  expertId: number = 1;

  displayModal: boolean = false;
  selectedConsultationDetails?: Consultation;

  pieChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#42A5F5', '#FFCE56', '#FF6384', '#4BC0C0', '#FF7043', '#8E24AA', '#FF8A65'],
        hoverBackgroundColor: ['#64B5F6', '#FFDA69', '#FF738A', '#81D4FA', '#FFCCBC', '#CE93D8', '#FFAB91'],
      }
    ]
  };

  pieChartOptions: any;

  constructor(
    private consultationService: ConsultationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
    this.initializePieChartOptions();
  }

  loadConsultations(): void {
    this.consultationService.getConsultationsByExpertId(this.expertId).subscribe(
      (data: Consultation[]) => {
        const now = new Date();

        this.consultations = data
          .map(consultation => ({
            ...consultation,
            isPast: new Date(consultation.dateConsultation) < now,
            selected: false
          }))
          .sort((a, b) => {
            const dateA = new Date(a.dateConsultation);
            const dateB = new Date(b.dateConsultation);
            const now = new Date();

            const isAFuture = dateA >= now;
            const isBFuture = dateB >= now;

            if (isAFuture && !isBFuture) return -1;
            if (!isAFuture && isBFuture) return 1;
            return dateA.getTime() - dateB.getTime();
          });

        this.filteredConsultations = [...this.consultations];
        this.checkPastConsultations();
        this.updatePieChartData();
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des consultations', error.message);
      }
    );
  }

  checkPastConsultations(): void {
    const now = new Date();
    const pastConsultation = this.consultations.find(consultation =>
      new Date(consultation.dateConsultation) < now &&
      (consultation.statut === 'VALIDÉE' || consultation.statut === 'EN_COURS')
    );

    if (pastConsultation) {
      this.notificationMessage = `Attention : La consultation ID ${pastConsultation.id} est passée et doit être marquée comme "Terminée".`;
    } else {
      this.notificationMessage = '';
    }
  }

  onSelectionChange(event: any): void {
    console.log('Consultations sélectionnées:', event.value);
  }

  filterConsultations(): void {
    if (!this.selectedWeek || this.selectedWeek.length !== 2) {
      this.filteredConsultations = [...this.consultations];
      this.updatePieChartData();
      return;
    }

    const [startDate, endDate] = this.selectedWeek;

    this.filteredConsultations = this.consultations.filter(consultation => {
      const consultationDate = new Date(consultation.dateConsultation);
      return consultationDate >= startDate && consultationDate <= endDate;
    });

    this.updatePieChartData();
  }

  updatePieChartData(): void {
    const consultationsByDay: { [key: string]: number } = {};

    this.filteredConsultations.forEach(consultation => {
      const dateConsultation = new Date(consultation.dateConsultation);
      const dayKey = dateConsultation.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric'
      });

      if (!consultationsByDay[dayKey]) {
        consultationsByDay[dayKey] = 0;
      }
      consultationsByDay[dayKey]++;
    });

    const labels = Object.keys(consultationsByDay);
    const data = Object.values(consultationsByDay);

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#42A5F5', '#FFCE56', '#FF6384', '#4BC0C0', '#FF7043', '#8E24AA', '#FF8A65'],
          hoverBackgroundColor: ['#64B5F6', '#FFDA69', '#FF738A', '#81D4FA', '#FFCCBC', '#CE93D8', '#FFAB91'],
        }
      ]
    };
  }

  initializePieChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}`;
            }
          }
        }
      }
    };
  }

  openDetails(consultation: Consultation): void {
    this.selectedConsultationDetails = consultation;
    this.displayModal = true;
  }
}
