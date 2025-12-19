import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register{

  registerForm = new FormGroup({
    email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
    }),
    displayName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
    }),
    password: new FormControl('',{
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
    }),
});

errorMessage = "";
isLoading = false;

constructor(
    private authService: AuthService,
    private router: Router
) {}

onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registerForm.value;

    this.authService.register({
      email: formData.email!,
      displayName: formData.displayName!,
      password: formData.password!
    }).subscribe({
      next: () => {
        // Registration successful, user is now logged in
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Email already registered';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        console.error('Register error:', err);
      }
    });
  }
}