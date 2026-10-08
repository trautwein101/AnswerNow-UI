import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuestionService } from './question';
import { AnswerService } from './answer';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AdminService } from './admin';
import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';
import { AppRoutingModule } from '../app-routing-module';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';

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

  it('previews the dashboard from static data and rejects every management action', () => {
    const admin = TestBed.inject(AdminService);
    admin.getStats().subscribe(stats => expect(stats.totalUsers).toBe(5));
    TestBed.inject(HttpTestingController).expectOne('demo-data.json').flush({
      questions: [], answers: [], users: [{ id: 1, displayName: 'Sample user' }], stats: { totalUsers: 5 }
    });
    admin.getUsers().subscribe(users => expect(users[0].displayName).toBe('Sample user'));
    for (const operation of [admin.changeUserRole(1, 'Admin'), admin.setUserActiveStatus(1, false),
      admin.setUserPendingStatus(1, true), admin.setUserSuspendStatus(1, true), admin.setUserBanStatus(1, true)]) {
      operation.subscribe({ next: () => { throw new Error('Demo writes must be rejected'); },
        error: error => expect(error.message).toContain('paused') });
    }
  });

  it('shows the auth forms while disabling submission, including direct handler calls', () => {
    for (const component of [Login, Register]) {
      const fixture = component === Login ? TestBed.createComponent(Login) : TestBed.createComponent(Register);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Account access is paused');
      fixture.componentInstance.onSubmit();
      expect(fixture.componentInstance.isLoading).toBe(false);
      fixture.destroy();
    }
  });

  it('allows a sample dashboard but keeps the live dashboard protected by the admin guard', () => {
    TestBed.configureTestingModule({ imports: [AppRoutingModule] });
    const router = TestBed.inject(Router);
    for (const path of ['login', 'register']) expect(router.config.find(route => route.path === path)?.canActivate).toBeUndefined();
    const guard = router.config.find(route => route.path === 'admin')!.canActivate![0] as CanActivateFn;
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;
    expect(TestBed.runInInjectionContext(() => guard(route, state))).toBe(true);
    environment.demoMode = false;
    expect(TestBed.runInInjectionContext(() => guard(route, state))).toBe(false);
  });
});
