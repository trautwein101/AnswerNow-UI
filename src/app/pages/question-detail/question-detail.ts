import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { QuestionService } from '../../services/question';
import { AnswerService } from '../../services/answer';

import { Question } from '../../models/question';
import { Answer, AnswerVm } from '../../models/answer';

import { AuthService } from '../../services/auth';
import { User } from '../../models/auth';
import { Subject, takeUntil, Observable } from 'rxjs';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './question-detail.html',
  styleUrl: './question-detail.scss',
})
export class QuestionDetail implements OnInit, OnDestroy {

  question?: Question;
  answers: AnswerVm[] = [];

  votingInProgress = false;
  votedAnswers: Set<number> = new Set();

  private destroy$ = new Subject<void>();
  currentUser$!: Observable<User | null>;

  answerForm = new FormGroup({
    body: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    createdBy: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.currentUser$ = this.authService.currentUser$;

    if (!idParam) {
      this.router.navigate(['/questions']);
      return;
    }

    const id = Number(idParam);
    console.log('Detail route id:', id);

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (!user) return;
        const ctrl = this.answerForm.controls.createdBy;
        if (!ctrl.value){
          ctrl.setValue(user.email);
        }
      });

    this.loadQuestion(id);
    this.loadAnswers(id);
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  loadQuestion(id: number): void {
    this.questionService.getQuestionById(id)
      .subscribe({
        next: (question) => {
          this.question= question;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error loading question', err);
          this.router.navigate(['/questions']);
        }
      });
  }

  loadAnswers(questionId: number): void {
    this.answerService.getAnswersByQuestionId(questionId)
      .subscribe({
        next: (answers) => {
          this.answers = answers
          .map(a => ({
            ...a,
            voteScore: a.upVotes - a.downVotes
          }))
          .sort((a, b) => b.voteScore - a.voteScore);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error loading answers', err);
        }
      });
  }

  submitAnswer(): void {
    if(this.answerForm.invalid || !this.question){
      return;
    }

    const formData = this.answerForm.value;

    this.answerService.createAnswer(this.question.id, formData)
      .subscribe({
        next: (newAnswer) =>
        {
          const newAnswerVm: AnswerVm = {
            ...newAnswer,
            voteScore: newAnswer.upVotes - newAnswer.downVotes
          };

          this.answers = [newAnswerVm, ...this.answers]
          .sort((a, b) => b.voteScore - a.voteScore);
          this.answerForm.controls.body.reset('');
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error submitting answer', err);
        }
      });  
  }


  voteOnAnswer(answerId: number, isUpVote: boolean): void {
    // Prevent if already voting or already voted on this answer
    if (this.votingInProgress || this.votedAnswers.has(answerId)) {
      return;
    }

    this.votingInProgress = true;

    this.answerService.voteOnAnswer(answerId, isUpVote)
      .subscribe({
        next: (updatedAnswer) => {
          const updatedAnswerVm: AnswerVm = {
            ...updatedAnswer,
            voteScore: updatedAnswer.upVotes - updatedAnswer.downVotes
          };

          // Update the answer in our array
          this.answers = this.answers
          .map(a => a.id === answerId ? updatedAnswerVm : a)
          .sort((a, b) => b.voteScore - a.voteScore);

          // Mark this answer as voted
          this.votedAnswers.add(answerId);

          this.votingInProgress = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error voting on answer', err);
          this.votingInProgress = false;
        }
      });
  }

  hasVoted(answerId: number): boolean {
    return this.votedAnswers.has(answerId);
  } 

  trackByAnswerId(_: number, answer: AnswerVm): number {
      return answer.id;
    }

}