import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SatisfactionSurvey } from '../models/satisfaction-survey.model';
@Injectable({
  providedIn: 'root'
})
export class SatisfactionSurveyService {

  private apiUrl = 'http://localhost:8069/api/claims/survey';  // L'URL de votre API

  constructor(private http: HttpClient) { }

  submitSurvey(survey: SatisfactionSurvey): Observable<any> {
    return this.http.post(this.apiUrl, survey, { responseType: 'text' });
  }
  
}
