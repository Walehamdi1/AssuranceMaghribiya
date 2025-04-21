import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chatbot/ask'; // L'URL de votre backend Spring Boot

  constructor(private http: HttpClient) {}

  /**
   * Envoie la question au chatbot (backend Spring) et retourne la réponse.
   * @param question La question posée par l'utilisateur.
   * @returns Observable contenant la réponse du chatbot.
   */
  askQuestion(question: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { question }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        // Gestion d'erreur : en cas d'erreur de l'API, on retourne un message d'erreur.
        console.error('Erreur lors de l\'appel API:', error);
        return of({ message: 'Erreur lors de la récupération de la réponse du chatbot.' });
      })
    );
  }
}
