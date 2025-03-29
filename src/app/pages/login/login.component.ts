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
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
    CommonModule
  ],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);

  hide = true;
  loginForm!: FormGroup;
  loginError = signal<string | null>(null); 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  // Login method
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const message = response.message ?? 'Login successful'; 
        this.matSnackBar.open(message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        setTimeout(() => {
          window.location.href = ' http://localhost:53320/';
        }, 1000);
      },
      error: (error) => {
        const message = error?.error?.message || 'Incorrect email or password';
        this.loginError.set(message);
        this.matSnackBar.open(message, '', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      },
    });
  }

 
  errorMessage(): string | null {
    return this.loginError();
  }

  
  get email() {
    return this.loginForm.get('email');
  }
  
}

