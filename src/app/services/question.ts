import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Question`;

  constructor(private http: HttpClient) {}

  // GET /api/Question
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  // GET /api/Question/{id}
  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  // POST /api/Question
  createQuestion(question: Partial<Question>): Observable<Question>{
    return this.http.post<Question>(this.apiUrl, question);
  }
  
}
