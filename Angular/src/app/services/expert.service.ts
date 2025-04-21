import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Expert } from '../models/expert.model';
@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  // Utilisation de la même URL que votre backend
  private apiUrl = 'http://localhost:8080/api/experts'; // URL de l'API backend
  expertService: any;
  filteredExperts: any[] | undefined;
  experts: any;

  constructor(private http: HttpClient) {}

  // Récupérer tous les experts
  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des experts', error);
        return throwError(error);  // Vous pouvez gérer l'erreur ici
      })
    );
  }

  // Ajouter un expert
  addExpert(expert: Expert): Observable<Expert> {
    // Ne pas envoyer l'ID, le laisser à undefined ou null
    expert.id = undefined;  // Ou null si vous préférez.
    
    return this.http.post<Expert>(this.apiUrl, expert).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout de l\'expert', error);
        return throwError(error);
      })
    );
  }
  
  loadExperts(): void {
    this.getAllExperts().subscribe(
      (data: Expert[]) => {
        console.log(data);  // Affichez la réponse dans la console
        this.experts = data;
        this.filteredExperts = [...this.experts];  // Assurez-vous que filteredExperts est mis à jour
      },
      (error: any) => {
        console.error('Erreur lors du chargement des experts:', error);
      }
    );
  }
  
  getExperts() {
    return this.http.get<Expert[]>('/api/experts');  // Assurez-vous que l'URL est correcte
  }
  

  // Supprimer un expert par son ID
  // Supprimer un expert par son ID
deleteExpert(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    catchError((error) => {
      console.error('Erreur lors de la suppression de l\'expert', error);
      return throwError(error);  // Vous pouvez gérer l'erreur ici
    })
  );
}
updateExpert(id: number, expert: Expert): Observable<Expert> {
  return this.http.put<Expert>(`${this.apiUrl}/${id}`, expert);
}

getExpertById(id: number): Observable<Expert> {
  return this.http.get<Expert>(`${this.apiUrl}/${id}`);
}



  
  
}

