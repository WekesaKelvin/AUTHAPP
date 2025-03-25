import { Component, inject } from '@angular/core';
import { Router ,RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-forget-password',
  standalone: true, 
  imports: [
    NgIf,
    ReactiveFormsModule,  
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting = false;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      const email = this.forgotPasswordForm.value.email;
      this.authService.forgotPassword(email).subscribe({
        next: (message) => {
          this.successMessage = message;
          this.isSubmitting = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isSubmitting = false;
        }
      });
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    } else if (emailControl?.hasError('email')) {
      return 'Enter a valid email address';
    }
    return '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
