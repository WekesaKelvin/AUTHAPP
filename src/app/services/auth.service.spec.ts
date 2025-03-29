import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl || 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should login successfully and store token', () => {
    const mockToken = 'fake-jwt-token';
    const loginData: LoginRequest = { email: 'test@example.com', password: 'password123' };

    authService.login(loginData).subscribe((res: AuthResponse) => {
      expect(res.isSuccess).toBe(true);
      expect(res.token).toBe(mockToken);
      expect(sessionStorage.getItem('authToken')).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${apiUrl}/authenticate`);
    expect(req.request.method).toBe('POST');
    req.flush({ jwtToken: mockToken });
  });

  it('should return true when signup is successful', () => {
    const signupData = { name: 'Test User', email: 'test@example.com', password: 'password123' };

    authService.signup(signupData.name, signupData.email, signupData.password).subscribe((res) => {
      expect(res).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/sign-up`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, name: 'Test User', email: 'test@example.com' });
  });

  it('should logout and clear session storage', () => {
    sessionStorage.setItem('authToken', 'fake-jwt-token');
    authService.logout();
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });

  it('should detect if user is logged in', () => {
    sessionStorage.setItem('authToken', 'fake-jwt-token');
    expect(authService.isLoggedIn()).toBe(true);
    sessionStorage.removeItem('authToken');
    expect(authService.isLoggedIn()).toBe(false);
  });

  it('should send forgot password request and return success message', () => {
    const email = 'test@example.com';

    authService.forgotPassword(email).subscribe((res) => {
      expect(res).toBe('Password reset link sent successfully. Please check your email.');
    });

    const req = httpMock.expectOne(`${apiUrl}/forgot-password?email=${email}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should reset password successfully', () => {
    const token = 'reset-token';
    const newPassword = 'newPassword123';

    authService.resetPassword(token, newPassword).subscribe((res) => {
      expect(res).toBe('Password reset successfully.');
    });

    const req = httpMock.expectOne(`${apiUrl}/reset-password?token=${token}&newPassword=${newPassword}`);
    expect(req.request.method).toBe('POST');
    req.flush('Password reset successfully.');
  });
});
