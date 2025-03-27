import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        MockProvider(AuthService, authServiceMock),
        MockProvider(Router, routerMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });

  it('should validate email and password fields', () => {
    component.loginForm.setValue({ email: '', password: '' });

    expect(component.email?.valid).toBeFalsy();
    expect(component.loginForm.get('password')?.valid).toBeFalsy();

    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });

    expect(component.email?.valid).toBeTruthy();
    expect(component.loginForm.get('password')?.valid).toBeTruthy();
  });

  it('should call login on AuthService when form is valid', () => {
    const testCredentials = { email: 'test@example.com', password: 'password123' };
    authServiceMock.login.mockReturnValue(of({ message: 'Login successful', isSuccess: true }));
    component.loginForm.setValue(testCredentials);

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith(testCredentials);
  });

  it('should handle login failure and display error message', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Login failed');
  });

  // it('should display success message in snackbar on success', () => {
  //   // MatSnackBar test commented out
  // });

  // it('should display error message in snackbar on failure', () => {
  //   // MatSnackBar test commented out
  // });
});
