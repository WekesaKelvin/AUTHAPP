import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgetPasswordComponent } from './forget-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      forgotPassword: jest.fn(),
    } as Partial<jest.Mocked<AuthService>> as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as Partial<jest.Mocked<Router>> as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
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

  it('should initialize the form with an empty email', () => {
    expect(component.forgotPasswordForm.value).toEqual({ email: '' });
  });

  it('should return correct error messages for email field', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    emailControl?.setValue('');
    expect(component.getEmailErrorMessage()).toBe('Email is required');

    emailControl?.setValue('invalid-email');
    expect(component.getEmailErrorMessage()).toBe('Enter a valid email address');
  });

  it('should call forgotPassword on AuthService when form is valid', () => {
    const testEmail = 'test@example.com';
    authServiceMock.forgotPassword.mockReturnValue(of('Password reset link sent'));
    component.forgotPasswordForm.setValue({ email: testEmail });

    component.onSubmit();

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith(testEmail);
    expect(component.successMessage).toBe('Password reset link sent');
  });

  it('should handle errors from forgotPassword service', () => {
    authServiceMock.forgotPassword.mockReturnValue(throwError(() => new Error('Something went wrong')));
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Something went wrong');
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  // it('should display success message in snackbar on success', () => {
  //   // MatSnackBar test commented out
  // });

  // it('should display error message in snackbar on failure', () => {
  //   // MatSnackBar test commented out
  // });
});
