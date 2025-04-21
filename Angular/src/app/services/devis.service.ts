import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devis } from '../models/Devis.model';


@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://localhost:8069/api/devis';

  constructor(private http: HttpClient) {}

  getAllDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(this.apiUrl+"/getAllDevis");
  }

  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.apiUrl}/${id}`);
  }
  getDevisByUser(): Observable<Devis[]> {
    return this.http.get<Devis[]>(`${this.apiUrl}/user`);
  }
  signerDevisBase64(devisId: number, signatureBase64: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signer/${devisId}`, { signatureBase64 }, {
      responseType: 'text' as 'json'
    });
  }

  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/ajouter-voyage", devis);
  }
  createDevisHabitation(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/ajouter-habitation", devis);
  }
  
  compareSignature(devisId: number, imageBase64: string) {
    return this.http.post<{ match: boolean }>(
      `http://localhost:8081/api/devis/${devisId}/compare-signature`,
      { imageBase64 }
    );
  }
  
  

  updateDevis(id: number, devis: Devis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/modifier/${id}`, devis);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  signerDevis(devisId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${devisId}/signer`, formData);
}
  
}
