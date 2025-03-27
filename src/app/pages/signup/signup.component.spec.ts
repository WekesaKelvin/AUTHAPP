import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      signup: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupComponent],
      providers: [
        MockProvider(AuthService, authServiceMock),
        MockProvider(Router, routerMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.signupForm.value).toEqual({
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should validate email, name, password, and confirmPassword fields', () => {
    component.signupForm.setValue({
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    });

    expect(component.signupForm.get('email')?.valid).toBeFalsy();
    expect(component.signupForm.get('name')?.valid).toBeFalsy();
    expect(component.signupForm.get('password')?.valid).toBeFalsy();
    expect(component.signupForm.get('confirmPassword')?.valid).toBeFalsy();

    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should check password and confirmPassword match', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password1234',
    });

    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors).toEqual({ mismatch: true });

    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should call signup on AuthService when form is valid', () => {
    const testCredentials = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    authServiceMock.signup.mockReturnValue(of(true));
    component.signupForm.setValue({ ...testCredentials, confirmPassword: 'password123' });

    component.onSubmit();

    expect(authServiceMock.signup).toHaveBeenCalledWith(
      testCredentials.name,
      testCredentials.email,
      testCredentials.password
    );
  });

  it('should navigate to login after successful signup', () => {
    authServiceMock.signup.mockReturnValue(of(true));
    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle signup failure and display error message', () => {
    authServiceMock.signup.mockReturnValue(throwError(() => new Error('Signup failed')));

    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Signup failed. Please try again.');
    expect(component.isLoading()).toBeFalsy();
  });

  it('should display "User already exists" message for 409 error', () => {
    authServiceMock.signup.mockReturnValue(
      throwError(() => ({ status: 409, message: 'User already exists' }))
    );

    component.signupForm.setValue({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('User already exists');
    expect(component.isLoading()).toBeFalsy();
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
