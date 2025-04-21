import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: number;
  role: string;
  // Add additional properties as needed
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8069/config';

  constructor(private http: HttpClient) {}

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/id/${userId}`);

  }
}
