import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Consultation } from '../models/consulting.model';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailApiUrl = 'http://localhost:8069/api/claims/sendEmail';

  constructor(private http: HttpClient, private clientService: ClientService) {}

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      to,
      subject,
      body
    };

    return this.http.post(this.emailApiUrl, payload, { headers });
  }

  sendConsultationEmail(consultation: Consultation, type: string): Observable<any> {
    const emailSubject = type === 'confirmed' ? 'Consultation Confirmée' : 'Consultation Rejetée';
    const emailBody = type === 'confirmed'
      ? `Votre consultation a été confirmée. Votre date de consultation est le ${consultation.dateConsultation}.`
      : `Votre consultation a été rejetée. Veuillez choisir une nouvelle date de consultation.`;
  
    return this.clientService.getClientEmailById(consultation.clientId).pipe(
      switchMap(email => {
        const emailData = {
          recipient: email,
          subject: emailSubject,
          body: emailBody
        };
  
        return this.http.post(this.emailApiUrl, emailData);
      })
    );
  }
}
