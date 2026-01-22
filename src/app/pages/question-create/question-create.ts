import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { QuestionService } from '../../services/question';
import { AuthService } from '../../services/auth';
import { User } from '../../models/auth';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss',
})
export class QuestionCreate implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();

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
      validators: [Validators.required, Validators.email ] 
    }),
  });

  constructor(
    private questionService: QuestionService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (!user) return;

        //only auto-fill if user hasn't touched the field
        const ctrl = this.questionForm.controls.createdBy;
        if (!ctrl.value){
          ctrl.setValue(user.email);
        }
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formData = this.questionForm.value;

    this.questionService.createQuestion(formData).subscribe({
      next: (created) => {
        this.router.navigate(['/questions', created.id]);
      },
      error: (err) => {
        console.error('Error creating question:', err);
      }
    });
  }
}