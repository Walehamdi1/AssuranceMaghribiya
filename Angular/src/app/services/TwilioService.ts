import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private twilioApiUrl = 'http://localhost:8069/api/twilio/sendSms';

  constructor(private http: HttpClient) {}

  sendSms(to: string, message: string): Observable<any> {
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const payload = {
      to,
      message,
      userId: user?.id,
      userEmail: user?.email
    };

    // ✅ Use HttpHeaders explicitly
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.twilioApiUrl, payload, { headers });
  }
}
