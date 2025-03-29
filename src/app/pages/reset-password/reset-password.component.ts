import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Extract token from URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.resetPasswordForm.patchValue({ token });
      }
    });
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const { newPassword } = this.resetPasswordForm.value;
      const token = this.route.snapshot.queryParams['token'];
      this.authService.resetPassword(token, newPassword).subscribe({
        next: () => {
          this.snackBar.open('Password reset successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Invalid or expired token.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
