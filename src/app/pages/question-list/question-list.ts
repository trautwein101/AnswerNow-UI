import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuestionService } from '../../services/question';
import { Question } from '../../models/question';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss'
})
export class QuestionList {

  questions: Question[] = [];

  constructor(
    private questionService: QuestionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestions()
      .subscribe({
        next: (data) => {
          console.log('Question list data', data);
          this.questions = data;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error loading questions', err);
        }
      });
  }
}
