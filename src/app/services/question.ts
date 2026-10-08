import { DemoDataService } from './demo-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Question`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  // GET /api/Question
  getQuestions(): Observable<Question[]> {
    if (environment.demoMode) return this.demo.load().pipe(map(data => data.questions));
    return this.http.get<Question[]>(this.apiUrl);
  }

  // GET /api/Question/{id}
  getQuestionById(id: number): Observable<Question> {
    if (environment.demoMode) return this.demo.load().pipe(map(data => {
      const question = data.questions.find(q => q.id === id);
      if (!question) throw new Error('Sample question not found');
      return question;
    }));
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  // POST /api/Question
  createQuestion(question: Partial<Question>): Observable<Question>{
    if (environment.demoMode) return throwError(() => new Error('Posting and voting are paused in portfolio demo mode.'));
    return this.http.post<Question>(this.apiUrl, question);
  }
  
}
