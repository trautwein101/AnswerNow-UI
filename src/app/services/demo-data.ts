import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { Question } from '../models/question';
import { Answer } from '../models/answer';

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private readonly data;
  constructor(http: HttpClient) {
    this.data = http.get<{ questions: Question[]; answers: Answer[] }>('demo-data.json')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }
  load() { return this.data; }
}
