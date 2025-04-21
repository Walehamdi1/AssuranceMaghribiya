import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';

import { tap } from 'rxjs/operators';
import { TwilioService } from './TwilioService';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private apiUrl = 'http://localhost:8069/api/claims';

  constructor(private http: HttpClient, private twilioService: TwilioService) { }

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  getClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  createClaim(claim: Claim, userPhoneNumber: string): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim).pipe(
      tap(() => {
        const message = `We’ve received your claim. Processing in progress ${claim.status}`;
        this.twilioService.sendSms(userPhoneNumber, message).subscribe();
      })
    );
  }

  updateClaim(id: number, claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}`, claim);
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClaimsByUser(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/user`);
  }
  
  getPredefinedDescriptions(type: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/descriptions/${type}`);
  }
  getClaimAnalysis(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/analyze/${id}`, { responseType: 'text' });
  }
  getEstimatedProcessingTime(description: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/analyze-description`, {
      params: { description }
    });
  }
}
