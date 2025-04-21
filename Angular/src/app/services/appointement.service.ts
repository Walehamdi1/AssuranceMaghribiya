import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointement } from '../models/appointement.model'; // Assurez-vous de créer ce modèle
import { tap } from 'rxjs/operators';
import { TwilioService } from './TwilioService';


@Injectable({
  providedIn: 'root'
})
export class AppointementService {

  private baseUrl = 'http://localhost:8069/api/appointments'; // Remplacez l'URL par celle de votre API

  constructor(private http: HttpClient, private twilioService: TwilioService) {}

  // Créer un rendez-vous
  createAppointment(appointment: Appointement, userPhoneNumber: string): Observable<Appointement> {
    return this.http.post<Appointement>(this.baseUrl, appointment).pipe(
      tap(() => {
        const message = `Votre rendez-vous a bien été enregistré. ${appointment.description}`;
        this.twilioService.sendSms(userPhoneNumber, message).subscribe();
      })
    );
  }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointement[]> {
    return this.http.get<Appointement[]>(this.baseUrl);
  }

  // Récupérer un rendez-vous par ID
  getAppointmentById(id: number): Observable<Appointement> {
    return this.http.get<Appointement>(`${this.baseUrl}/${id}`);
  }

  // Mettre à jour un rendez-vous
  updateAppointment(id: number, appointement: Appointement): Observable<Appointement> {
    return this.http.put<Appointement>(`${this.baseUrl}/${id}`, appointement);
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les rendez-vous archivés (archiver = 0)
getArchivedAppointments(): Observable<Appointement[]> {
  return this.http.get<Appointement[]>(`${this.baseUrl}/archived`);
}

getAppointmentsByUser(): Observable<Appointement[]> {
  return this.http.get<Appointement[]>(`${this.baseUrl}/user`);
}

getOptimalAppointment(clientId: string): Observable<string> {
  return this.http.get<string>(`${this.baseUrl}/suggest/${clientId}`, { responseType: 'text' as 'json' });
}

checkDateAvailability(date: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/check-availability/${date}`);
}

  // --- Méthodes Reporter ---

  // Appelle l’endpoint pour reporter le rendez-vous d’un nombre de jours donné.
  reportAppointment(id: number, days: number): Observable<Appointement> {
    return this.http.put<Appointement>(`${this.baseUrl}/${id}/report?days=${days}`, {});
  }

  // Appelle l’endpoint pour annuler (archiver) le rendez-vous.




}
