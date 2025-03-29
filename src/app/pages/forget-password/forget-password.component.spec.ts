import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ForgetPasswordComponent } from './forget-password.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    authServiceMock = {
      forgotPassword: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
      ],
      declarations: [ForgetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with an empty email field', () => {
    expect(component.forgotPasswordForm.value.email).toBe('');
  });

  it('should show validation error when email is empty', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getEmailErrorMessage()).toBe('Email is required');
  });

  it('should show validation error when email is invalid', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getEmailErrorMessage()).toBe('Enter a valid email address');
  });

  it('should call forgotPassword() on form submission and display success message', async () => {
    (authServiceMock.forgotPassword as jest.Mock).mockReturnValue(of('Password reset link sent successfully.'));

    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.successMessage).toBe('Password reset link sent successfully.');
    expect(component.errorMessage).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  it('should handle API error when forgotPassword() fails', async () => {
    (authServiceMock.forgotPassword as jest.Mock).mockReturnValue(throwError(() => new Error('Error occurred')));

    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.errorMessage).toBe('Error occurred');
    expect(component.successMessage).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  it('should navigate to login page when navigateToLogin() is called', () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
