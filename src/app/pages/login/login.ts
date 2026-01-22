import { Component, ChangeDetectorRef, NgZone } from "@angular/core";  
import { CommonModule } from "@angular/common";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth";

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
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ){}
    
    onSubmit(): void {
        if (this.isLoading) return; // Prevent multiple submissions smokey

        if(this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const {email, password} = this.loginForm.value;

        this.authService.login({email: email!, password: password! })
        .subscribe({
            next: () => {
                this.zone.run(() => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                });
            },
            error: (err) => {
                this.zone.run(() => {
                this.isLoading = false;
                this.errorMessage = 'Invalid email or password';
                this.cdr.markForCheck();
                });
                console.error('Login error:', err);
            }
        });
    }



}