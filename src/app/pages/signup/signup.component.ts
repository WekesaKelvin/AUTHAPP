import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SignupComponent {
  // Functional Dependency Injection
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);


  // Reactive form with custom password match validator
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  // Signals for reactive state management
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  isFormValid = computed(() => this.signupForm.valid && !this.isLoading());

  constructor() {
    effect(() => {
      console.log('Signup form valid:', this.isFormValid());
    });
  }

  
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    const { email,username, password } = this.signupForm.value;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    
    this.authService.signup(email!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);  
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('User already exists');
        } else {
          this.errorMessage.set(err.message || 'Signup failed. Please try again.');
        }
      }
    });

    this.snackBar.open('Signup successful! Welcome!', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
