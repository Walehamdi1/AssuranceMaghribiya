import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointementService } from '../services/appointement.service';
import { Appointement } from '../models/appointement.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointement | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private appointementService: AppointementService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du rendez-vous à partir des query parameters
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadAppointment(id);
      } else {
        this.errorMessage = 'Aucun identifiant fourni.';
        this.loading = false;
      }
    });
  }

  loadAppointment(id: number): void {
    this.appointementService.getAppointmentById(id).subscribe(
      (data: Appointement) => {
        this.appointment = data;
        this.loading = false;
      },
      error => {
        console.error('Erreur lors du chargement des détails du rendez-vous', error);
        this.errorMessage = 'Erreur lors du chargement du rendez-vous.';
        this.loading = false;
      }
    );
  }

  // Méthode pour reporter le rendez-vous
  onReport(days: number): void {
    if (this.appointment) {
      this.appointementService.reportAppointment(this.appointment.idAppointment, days)
        .subscribe(
          updated => {
            this.appointment = updated;
            this.message = `✅ Rendez-vous reporté au ${new Date(updated.dateSubmitted).toLocaleDateString()}`;
          },
          error => {
            this.message = error.error || '❌ Erreur lors du report, veuillez réessayer.';
          }
        );
    } else {
      this.message = '❗ Aucun rendez-vous chargé.';
    }
  }
}
