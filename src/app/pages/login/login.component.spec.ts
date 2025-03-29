import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: Partial<AuthService>;
  let matSnackBarMock: Partial<MatSnackBar>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };
    matSnackBarMock = {
      open: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call AuthService login method on valid form submission', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    (authServiceMock.login as jest.Mock).mockReturnValue(of({ message: 'Login successful' }));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Login successful', 'Close', { duration: 5000, horizontalPosition: 'center' });
  });

  it('should show error message when login fails', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpass' });
    (authServiceMock.login as jest.Mock).mockReturnValue(throwError(() => ({ error: { message: 'Incorrect email or password' } })));

    component.onSubmit();

    expect(component.errorMessage()).toBe('Incorrect email or password');
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Incorrect email or password', '', { duration: 5000, horizontalPosition: 'center' });
  });
});
