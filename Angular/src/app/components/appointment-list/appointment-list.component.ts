import { Component, OnInit } from '@angular/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointement[] = [];
  archivedAppointments: Appointement[] = [];
  searchText: string = '';

  // Pagination variables
  page: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  // Pour le filtrage par utilisateur
  selectedUserId: number | null = null;
  users: { id: number, name: string }[] = []; // Liste des utilisateurs

  constructor(private appointementService: AppointementService) {}

  ngOnInit(): void {
    this.getAppointments();
    this.getArchivedAppointments();
   // this.getUsers(); // Charger la liste des utilisateurs
  }

  getAppointments(): void {
    this.appointementService.getAllAppointments().subscribe(
      data => {
        this.appointments = data;
        this.calculatePages();
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  getAppointmentsForUser(): void {
    this.appointementService.getAppointmentsByUser().subscribe(
      data => {
        this.appointments = data;
        this.calculatePages(); // Recalculer les pages après avoir récupéré les rendez-vous
      },
      error => {
        console.error('Error fetching appointments for user', error);
      }
    );
  }
  
  

  getArchivedAppointments(): void {
    this.appointementService.getArchivedAppointments().subscribe(
      data => {
        this.archivedAppointments = data;
      },
      error => {
        console.error('Erreur lors de la récupération des rendez-vous archivés', error);
      }
    );
  }

 // getUsers(): void {
    // Simuler une liste d'utilisateurs (remplacez cela par une API si nécessaire)
  //  this.users = [
    //  { id: 1, name: 'Alice' },
    //  { id: 2, name: 'Bob' },
    //  { id: 3, name: 'Charlie' }
   // ];
 // }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.displayedAppointments.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.page = 1; // Réinitialiser la pagination lors d'un changement de filtre
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

  changeStatus(appointment: Appointement): void {
    let newStatus: string;
    switch (appointment.status) {
      case 'PENDING':
        newStatus = 'CONFIRMED';
        break;
      case 'CONFIRMED':
        newStatus = 'CANCELED';
        break;
      case 'CANCELED':
        newStatus = 'PENDING';
        break;
      default:
        newStatus = 'PENDING';
    }
    appointment.status = newStatus;
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      updated => {
        appointment.status = updated.status;
      },
      error => {
        console.error("Erreur lors de la mise à jour du statut", error);
      }
    );
  }

  archiveAppointment(appointment: Appointement): void {
    appointment.archiver = false; // Marquer comme archivé
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      () => {
        // Retirer de la liste des rendez-vous actifs
        this.appointments = this.appointments.filter(app => app.idAppointment !== appointment.idAppointment);
        // Ajouter à la liste des archivés
        this.archivedAppointments.push(appointment);
        this.calculatePages();
      },
      error => {
        console.error("Erreur lors de l'archivage du rendez-vous", error);
      }
    );
  }
  

  unarchiveAppointment(appointment: Appointement): void {
    appointment.archiver = true; // Désarchiver
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      () => {
        // Retirer de la liste des archivés
        this.archivedAppointments = this.archivedAppointments.filter(app => app.idAppointment !== appointment.idAppointment);
        // Ajouter à la liste des rendez-vous actifs
        this.appointments.push(appointment);
        this.calculatePages();
      },
      error => {
        console.error("Erreur lors du désarchivage du rendez-vous", error);
      }
    );
  }
  

  // Filtrage des rendez-vous selon l'utilisateur sélectionné
  get displayedAppointments(): Appointement[] {
    let list = this.appointments;
  
    // Appliquer le filtre par userId si un utilisateur est sélectionné
    if (this.selectedUserId !== null) {
      list = list.filter(app => app.userId === this.selectedUserId);
    }
  
    // Appliquer la recherche
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      list = list.filter(app => {
        const description = app.description ? app.description.toLowerCase() : '';
        const status = app.status ? app.status.toLowerCase() : '';
        const submittedDate = app.dateSubmitted ? new Date(app.dateSubmitted).toLocaleDateString().toLowerCase() : '';
        return description.includes(search) || status.includes(search) || submittedDate.includes(search);
      });
    }
  
    return list;
  }
  

  applyUserFilter(): void {
    this.calculatePages();
  }

  clearUserFilter(): void {
    this.selectedUserId = null;
    this.calculatePages();
  }
}
