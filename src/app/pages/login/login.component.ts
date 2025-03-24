import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);

  hide = true;
  loginForm!: FormGroup;
  loginError = signal<string | null>(null); // For error message display

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username instead of email
      password: ['', [Validators.required, Validators.minLength(6)]], // Adding minlength validation
    });
  }

  // Login method
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        const message = error?.error?.message || 'Login failed';
        this.loginError.set(message);
        this.matSnackBar.open(message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      },
    });
  }

  // Displaying error message in HTML
  errorMessage(): string | null {
    return this.loginError();
  }

  // Optional Forgot Password & Sign Up navigation
  navigateToSignup(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}

