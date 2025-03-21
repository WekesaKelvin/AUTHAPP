import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,        
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: ReturnType<FormBuilder['group']>;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  errorMessage = signal<string | null>(null);

  // private fb = inject(FormBuilder);
  // private authService = inject(AuthService);
  // private router = inject(Router);

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']); 
              // Redirect to main app (e.g., https://app.yourdomain.com)
          } else {
            this.errorMessage.set('Login failed');
          }
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Login failed');
        }
      });
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
