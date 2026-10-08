import { DemoDataService } from './demo-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Answer`;
  
  constructor(private http: HttpClient, private demo: DemoDataService){}

  // GET /api/Answer?questionId=123
  getAnswersByQuestionId(questionId: number): Observable<Answer[]>{
    if (environment.demoMode) return this.demo.load().pipe(map(data => data.answers.filter(a => a.questionId === questionId)));
    return this.http.get<Answer[]>(`${this.apiUrl}?questionId=${questionId}`);
  }

  // POST /api/Answer?questionId=123
  createAnswer(questionId: number, answer: Partial<Answer>): Observable<Answer>{
    if (environment.demoMode) return throwError(() => new Error('Posting and voting are paused in portfolio demo mode.'));
    return this.http.post<Answer>(`${this.apiUrl}?questionId=${questionId}`, answer);
  }

  // POST /api/Answer/{id}/vote?isUpVote=true
  voteOnAnswer(answerId: number, isUpVote: boolean): Observable<Answer>{
    if (environment.demoMode) return throwError(() => new Error('Posting and voting are paused in portfolio demo mode.'));
    return this.http.post<Answer>(`${this.apiUrl}/${answerId}/vote?isUpVote=${isUpVote}`, {});
  }

  

}
