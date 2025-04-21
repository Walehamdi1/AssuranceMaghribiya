import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Client } from 'src/app/models/client.model'; // Importer le modèle Client

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/api/clients';  // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Récupérer l'email du client en fonction de son ID
  getClientEmailById(clientId: number): Observable<string> {
    return this.http.get<{ email: string }>(`${this.apiUrl}/${clientId}`).pipe(
      map((client: { email: any; }) => client.email)
    );
  }
  getClientById(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${clientId}`);  // Retourne un Observable<Client>
  }
}
