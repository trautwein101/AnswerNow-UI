import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {

  private apiUrl = 'https://localhost:7252/api/Answer';
  
  constructor(private http: HttpClient){}

  // GET /api/Answer?questionId=123
  getAnswersByQuestionId(questionId: number): Observable<Answer[]>{
    return this.http.get<Answer[]>(`${this.apiUrl}?questionId=${questionId}`);
  }

  // POST /api/Answer?questionId=123
  createAnswer(questionId: number, answer: Partial<Answer>): Observable<Answer>{
    return this.http.post<Answer>(`${this.apiUrl}?questionId=${questionId}`, answer);
  }

  // POST /api/Answer/{id}/vote?isUpVote=true
  voteOnAnswer(answerId: number, isUpVote: boolean): Observable<Answer>{
    return this.http.post<Answer>(`${this.apiUrl}/${answerId}/vote?isUpVote=${isUpVote}`, {});
  }

}
