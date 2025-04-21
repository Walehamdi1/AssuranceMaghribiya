import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Consultation } from '../models/consulting.model';
import { Expert } from '../models/expert.model';
import { Router } from '@angular/router'; 


@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = 'http://localhost:8080/api/consultations';
  private consultationsSubject = new BehaviorSubject<Consultation[]>([]);
  consultations$ = this.consultationsSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {} 
  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.apiUrl).pipe(
      tap(consultations => this.consultationsSubject.next(consultations)),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération des consultations:', error);
        return throwError(error);
      })
    );
  }

  createConsultation(consultation: Consultation): Observable<Consultation> {
    const formattedDate = this.formatDateForBackend(consultation.dateConsultation);
    const consultationData = { ...consultation, dateConsultation: formattedDate };
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<Consultation>(`${this.apiUrl}/create`, consultationData, { headers }).pipe(
      tap(newConsultation => this.addConsultationToList(newConsultation)),
      catchError((error) => {
        console.error('❌ Erreur lors de la création de la consultation:', error);
        return throwError(error);
      })
    );
  }
  

  private formatDateForBackend(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.getFullYear() + '-' +
           ('0' + (parsedDate.getMonth() + 1)).slice(-2) + '-' +
           ('0' + parsedDate.getDate()).slice(-2) + 'T' +
           ('0' + parsedDate.getHours()).slice(-2) + ':' +
           ('0' + parsedDate.getMinutes()).slice(-2) + ':' +
           ('0' + parsedDate.getSeconds()).slice(-2);
  }

  updateStatut(id: number, statut: string): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}/statut`, { statut }).pipe(
      tap(updatedConsultation => {
        const updatedList = this.consultationsSubject.getValue().map(consultation =>
          consultation.id === updatedConsultation.id ? updatedConsultation : consultation
        );
        this.consultationsSubject.next(updatedList);
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la mise à jour du statut:', error);
        return throwError(error);
      })
    );
  }
  
  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe( // Correction ici : ajouter les guillemets pour l'URL
      tap(() => {
        const updatedList = this.consultationsSubject.getValue().filter(c => c.id !== id);
        this.consultationsSubject.next(updatedList);
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la suppression de la consultation:', error);
        return throwError(error);
      })
    );
  }

  addConsultationToList(newConsultation: Consultation) {
    const currentConsultations = this.consultationsSubject.getValue();
    this.consultationsSubject.next([...currentConsultations, newConsultation]);
  }

  assignExpertToConsultation(consultationId: number, expertId: number): Observable<Consultation> {
    return this.http.put<Consultation>(
      `${this.apiUrl}/${consultationId}/assign-expert`, 
      { expertId }  // Envoie un objet contenant l'ID de l'expert
    );
  }

  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>('/api/experts');
  }
  updateConsultationStatut(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/consultations/${id}/statut`, { statut });
  }

  acceptConsultation(consultationId: number) {
    this.http.put(`http://localhost:8080/api/consultations/${consultationId}/accepter`, {})
      .subscribe({
        next: (response) => {
          console.log('Consultation acceptée', response);
          this.router.navigate([`/consultation/${consultationId}/expert`]); 
        },
        error: (error: any) => {  // Ajout du type 'any' pour l'erreur
          console.error('Erreur lors de l\'acceptation', error);
        }
      });
  }
  getConsultationById(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  getConsultationsByExpertId(expertId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`http://localhost:8080/api/consultations/expert/${expertId}`);
  }
  

  getConsultationStatistics(): Observable<{ maison: number; voiture: number; sante: number }> {
    return this.http.get<{ maison: number; voiture: number; sante: number }>(`${this.apiUrl}/statistics`);
  }

  searchConsultations(
    statut?: string, 
    objet?: string, 
    expertId?: number, 
    startDate?: string, 
    endDate?: string
  ): Observable<Consultation[]> {
    let params = new HttpParams();
  
    if (statut) {
      params = params.set('statut', statut);
    }
    if (objet) {
      params = params.set('objet', objet);
    }
    if (expertId) {
      params = params.set('expertId', expertId.toString());
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
  
    return this.http.get<Consultation[]>(`${this.apiUrl}/consultations/search`, { params });
  }
}
