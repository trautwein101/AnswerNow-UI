import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuestionService } from './question';
import { AnswerService } from './answer';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

describe('Portfolio demo network isolation', () => {
  const originalMode = environment.demoMode;
  beforeEach(() => {
    environment.demoMode = true;
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()
    ] });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    environment.demoMode = originalMode;
  });

  it('loads the static fixture once for list, details and answers without authentication', () => {
    const questions = TestBed.inject(QuestionService);
    const answers = TestBed.inject(AnswerService);
    const http = TestBed.inject(HttpTestingController);
    const question = { id: 1, title: 'Sample' };
    const answer = { id: 10, questionId: 1 };
    questions.getQuestions().subscribe(data => expect(data[0].title).toBe('Sample'));
    const request = http.expectOne('demo-data.json');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ questions: [question], answers: [answer] });
    questions.getQuestionById(1).subscribe(data => expect(data.id).toBe(1));
    answers.getAnswersByQuestionId(1).subscribe(data => expect(data.length).toBe(1));
    answers.getAnswersByQuestionId(2).subscribe(data => expect(data.length).toBe(0));
    questions.getQuestionById(999).subscribe({ error: error => expect(error.message).toContain('not found') });
  });

  it('rejects posting and voting without sending API requests', () => {
    const operations: Observable<unknown>[] = [
      TestBed.inject(QuestionService).createQuestion({ title: 'Example' }),
      TestBed.inject(AnswerService).createAnswer(1, { body: 'Example' }),
      TestBed.inject(AnswerService).voteOnAnswer(10, true)
    ];
    for (const operation of operations) operation.subscribe({
      next: () => { throw new Error('Demo writes must be rejected'); },
      error: error => expect(error.message).toContain('paused')
    });
  });

  it('uses the API when demo mode is disabled', () => {
    environment.demoMode = false;
    TestBed.inject(QuestionService).getQuestions().subscribe();
    TestBed.inject(HttpTestingController).expectOne(environment.apiBaseUrl + '/Question').flush([]);
  });
});
