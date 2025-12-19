import { Component } from "@angular/core";  
import { CommonModule } from "@angular/common";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth";
import { email } from "@angular/forms/signals";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
    loginForm = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email]
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
    });
 
    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ){}
    
    onSubmit(): void {
        if(this.loginForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const {email, password} = this.loginForm.value;

        this.authService.login({email: email!, password: password! })
        .subscribe({
            next: () => {
                //redirect after login
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigate([returnUrl]);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Invalid email or password';
                console.error('Login error:', err);
            }
        });
    }
}