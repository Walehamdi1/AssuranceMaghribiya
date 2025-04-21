import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  userId!: number;  // Dynamically set
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    editable: true,
    selectable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [] // Initialement vide
  };
  selectedAppointment: Appointement | null = null;
  allAppointments: Appointement[] = [];

  isLoading: boolean = false;
  claims: Claim[] = [];
  errorMessage: string = '';

  constructor(
    private appointementService: AppointementService,
    private claimsService: ClaimsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      this.userId = parsedUser.id;
      this.loadAppointments();
      this.loadClaims();
    } else {
      console.error("No user is logged in.");
      this.errorMessage = "Veuillez vous connecter pour voir vos rendez-vous.";
    }
  }

  // Méthodes liées aux rendez-vous
  loadAppointments(): void {
    this.appointementService.getAppointmentsByUser().subscribe(
      (data: Appointement[]) => {
        console.log('Données reçues:', data);
        this.allAppointments = data;
        this.calendarOptions.events = this.mapAppointmentsToEvents(data);
      },
      error => console.error('Erreur lors du chargement des rendez-vous', error)
    );
  }

  mapAppointmentsToEvents(appointments: Appointement[]): any[] {
    return appointments.map(appointment => ({
      title: appointment.description,
      start: new Date(appointment.dateSubmitted),
      extendedProps: {
        idAppointment: appointment.idAppointment,
        userId: appointment.user?.id
      },
      color: appointment.status === 'CONFIRMED' ? '#28a745' : '#dc3545'
    }));
  }

  handleEventClick(clickInfo: any): void {
    const appointmentId = clickInfo.event.extendedProps.idAppointment;
    this.router.navigate(['/appointment-detail'], { queryParams: { id: appointmentId } });
  }

  handleDateSelect(selection: any): void {
    console.log('Date sélectionnée:', selection.startStr);
    this.router.navigate(['/appointment/add'], { queryParams: { date: selection.startStr } });
  }

  // Méthodes liées aux réclamations
  loadClaims(): void {
    this.isLoading = true;
    this.claimsService.getClaimsByUser().subscribe({
      next: (data: Claim[]) => {
        console.log('Réclamations reçues:', data);
        this.claims = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des réclamations:', err);
        this.errorMessage = "Erreur lors de la récupération des réclamations.";
        this.isLoading = false;
      }
    });
  }
}
