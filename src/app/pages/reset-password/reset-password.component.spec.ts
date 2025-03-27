import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ResetPasswordComponent],
      providers: [
        MockProvider(AuthService, authServiceMock),
        MockProvider(Router, routerMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.resetPasswordForm.value).toEqual({ token: '', newPassword: '' });
  });

  it('should validate token and newPassword fields', () => {
    component.resetPasswordForm.setValue({ token: '', newPassword: '' });

    expect(component.resetPasswordForm.get('token')?.valid).toBeFalsy();
    expect(component.resetPasswordForm.get('newPassword')?.valid).toBeFalsy();

    component.resetPasswordForm.setValue({ token: '123456', newPassword: 'password123' });

    expect(component.resetPasswordForm.get('token')?.valid).toBeTruthy();
    expect(component.resetPasswordForm.get('newPassword')?.valid).toBeTruthy();
  });

  it('should call resetPassword on AuthService when form is valid', () => {
    const testCredentials = { token: '123456', newPassword: 'newPassword123' };
    authServiceMock.resetPassword.mockReturnValue(of('Password reset successful'));
    component.resetPasswordForm.setValue(testCredentials);

    component.onSubmit();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(testCredentials.token, testCredentials.newPassword);
  });

  it('should handle password reset failure and display error message', () => {
    authServiceMock.resetPassword.mockReturnValue(throwError(() => new Error('Password reset failed')));
    component.resetPasswordForm.setValue({ token: '123456', newPassword: 'newPassword123' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Password reset failed.');
    expect(component.isSubmitting).toBeFalsy();
  });

  // it('should display success message in snackbar on success', () => {
  //   // MatSnackBar test commented out
  // });

  // it('should display error message in snackbar on failure', () => {
  //   // MatSnackBar test commented out
  // });
});
