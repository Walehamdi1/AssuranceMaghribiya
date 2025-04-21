import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  dateofregistration: Date;
  email: string;
  type: string;
  firstname: string;
  lastname: string;
  password: string;
  phonenumber: string;
  username: string;
}

export interface Sinister {
  id: number;
  dateOfIncident: Date;
  description: string;
  status: string;
  location: string;
  evidenceFiles: string;
  typeInsurance: string;
  user: number;
  reportedDate: Date;
  dateofcreation: Date;
}

export interface SinisterDetail {
  id: number;
  location: string;
  agentID: string;
  clientID: string;
  description: string;
  reportedDate: Date;
  status: string;
  evidenceFiles: string;
  estimatedDamageCost: number;
  sinister: Sinister;
}

@Injectable({
  providedIn: 'root'
})
export class SinistersService {
  private apiUrl = 'http://localhost:8069/api/admin/sinisters';

  constructor(private http: HttpClient) {}

  getSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(this.apiUrl);
  }

  createClaim(claim: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('userId', claim.userId);
    formData.append('description', claim.description);
    formData.append('location', claim.location);
    formData.append('typeAssurance', claim.typeAssurance);
    formData.append('incidentDate', claim.incidentDate.toISOString());
    formData.append('document', file);

    return this.http.post(`${this.apiUrl}/create`, formData, { responseType: 'text' });
  }

  getSinisterById(id: number): Observable<Sinister> {
    return this.http.get<Sinister>(`${this.apiUrl}/${id}`);
  }

  getSinistersByUser(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(`${this.apiUrl}/user`);
  }
  
  updateSinister(id: number, userId: number, userEmail: string, sinister: Sinister): Observable<Sinister> {
    const url = `${this.apiUrl}/${id}?userId=${userId}&userEmail=${userEmail}`;
    return this.http.put<Sinister>(url, sinister);
  }

  deleteSinister(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getSinisterDetailsBySinisterId(id: number): Observable<SinisterDetail[]> {
    return this.http.get<SinisterDetail[]>(`${this.apiUrl}/${id}/details`);
  }

  getPendingSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(`${this.apiUrl}/pending`);
  }

  getMostRecentPendingSinisterDetails(): Observable<SinisterDetail[]> {
    return this.http.get<SinisterDetail[]>(`${this.apiUrl}/most-recent-pending`);
  }

  getStatusCountByDate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status-count-by-date`);
  }

  toggleArchiveSinister(id: number): Observable<Sinister> {
    return this.http.put<Sinister>(`${this.apiUrl}/toggle-archive/${id}`, {});
  }

  getEstimatedProcessingTime(typeInsurance: string): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/estimated-time?typeInsurance=${typeInsurance}`,
      { responseType: 'text' as 'json' }
    );
  }

  extractTextFromDocument(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('document', file);

    return this.http.post(`${this.apiUrl}/extract-text`, formData, { responseType: 'text' });
  }

  sendNotification(userId: number, message: string): Observable<string> {
    const body = new URLSearchParams();
    body.set('userId', userId.toString());
    body.set('message', message);

    return this.http.post(`${this.apiUrl}/send-notification`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'text'
    });
  }

  getTimeSpentInEachStatus(sinisterId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sinisterId}/time-spent`);
  }
}
