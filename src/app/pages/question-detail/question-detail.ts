import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { QuestionService } from '../../services/question';
import { AnswerService } from '../../services/answer';

import { Question } from '../../models/question';
import { Answer } from '../../models/answer';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './question-detail.html',
  styleUrl: './question-detail.scss',
})
export class QuestionDetail {

  question?: Question;
  answers: Answer[] = [];

  votingInProgress = false;
  votedAnswers: Set<number> = new Set();

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
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.router.navigate(['/questions']);
      return;
    }

    const id = Number(idParam);
    console.log('Detail route id:', id);

    this.loadQuestion(id);
    this.loadAnswers(id);
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
          this.answers = answers;
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
          this.answers = [newAnswer, ...this.answers];
          this.answerForm.reset();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error submitting answer', err);
        }
      });  
  }

 // REPLACE your voteOnAnswer method with this:
  voteOnAnswer(answerId: number, isUpVote: boolean): void {
    // Prevent if already voting or already voted on this answer
    if (this.votingInProgress || this.votedAnswers.has(answerId)) {
      return;
    }

    this.votingInProgress = true;

    this.answerService.voteOnAnswer(answerId, isUpVote)
      .subscribe({
        next: (updatedAnswer) => {
          // Update the answer in our array
          this.answers = this.answers.map(a =>
            a.id === answerId ? updatedAnswer : a
          );

          // Re-sort by vote score
          this.answers.sort((a, b) => b.voteScore - a.voteScore);

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

  // Helper method to check if user has voted on an answer
  hasVoted(answerId: number): boolean {
    return this.votedAnswers.has(answerId);
  } 

}