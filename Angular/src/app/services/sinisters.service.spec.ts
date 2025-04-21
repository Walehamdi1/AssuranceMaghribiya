// src/app/services/appointment-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentServiceService {
  private apiUrl = 'http://localhost:8069/api/appointments';

  constructor(private http: HttpClient) { }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // Pas besoin d'ajouter un token
  }

  // Ajouter un rendez-vous
  addAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, appointment);  // Pas d'authentification via JWT
  }

  // Mettre à jour un rendez-vous
  updateAppointment(id: number, appointment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, appointment);
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
