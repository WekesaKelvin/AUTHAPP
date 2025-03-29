import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;
  let snackBarMock: Partial<MatSnackBar>;

  beforeEach(async () => {
    authServiceMock = {
      signup: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };
    snackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate form correctly', () => {
    component.signupForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    jest.spyOn(authServiceMock, 'signup');

    component.signupForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.onSubmit();
    expect(authServiceMock.signup).not.toHaveBeenCalled();
  });

  it('should show error if passwords do not match', () => {
    component.signupForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'differentPassword',
    });

    expect(component.signupForm.errors).toEqual({ mismatch: true });
  });

  it('should call AuthService signup on valid form submission', () => {
    component.signupForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    (authServiceMock.signup as jest.Mock).mockReturnValue(of({}));

    component.onSubmit();

    expect(authServiceMock.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
    expect(snackBarMock.open).toHaveBeenCalledWith('Signup successful! Welcome!', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle signup failure', () => {
    component.signupForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    (authServiceMock.signup as jest.Mock).mockReturnValue(throwError(() => ({ status: 409 })));

    component.onSubmit();

    expect(component.errorMessage()).toBe('User already exists');
    expect(component.isLoading()).toBe(false);
  });

  it('should navigate to login page', () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
