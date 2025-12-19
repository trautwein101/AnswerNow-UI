import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss',
})
export class QuestionCreate {

  questionForm = new FormGroup({
    title: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.maxLength(200)] 
    }),
    body: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    }),
    createdBy: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    }),
  });

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.questionForm.invalid) {
      return;
    }

    const formData = this.questionForm.value;

    this.questionService.createQuestion(formData).subscribe({
      next: (created) => {
        console.log('Question created:', created);
        this.router.navigate(['/questions', created.id]);
      },
      error: (err) => {
        console.error('Error creating question:', err);
      }
    });
  }
}