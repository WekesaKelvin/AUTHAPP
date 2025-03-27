import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';

const mockToken = 'mock.jwt.token';
const mockUser = {
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
  roles: ['USER'],
  token: mockToken
};

const apiUrl = environment.apiUrl || 'http://localhost:8080';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and store token', () => {
    const loginData: LoginRequest = { email: 'test@example.com', password: 'password' };
    const mockResponse = { jwtToken: mockToken };

    service.login(loginData).subscribe((response: AuthResponse) => {
      expect(response.isSuccess).toBe(true);
      expect(response.token).toBe(mockToken);
      expect(sessionStorage.getItem('authToken')).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${apiUrl}/authenticate`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should signup successfully', () => {
    const name = 'New User';
    const email = 'new@example.com';
    const password = 'password';
    const mockSignupResponse = { id: 2, name, email };

    service.signup(name, email, password).subscribe((success) => {
      expect(success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/sign-up`);
    expect(req.request.method).toBe('POST');
    req.flush(mockSignupResponse);
  });

  it('should logout and clear session storage', () => {
    sessionStorage.setItem('authToken', mockToken);
    service.logout();
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });

  it('should return true if user is logged in', () => {
    sessionStorage.setItem('authToken', mockToken);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it('should send forgot password request successfully', () => {
    const email = 'test@example.com';
    service.forgotPassword(email).subscribe((message) => {
      expect(message).toBe('Password reset link sent successfully. Please check your email.');
    });

    const req = httpMock.expectOne(`${apiUrl}/forgot-password?email=${email}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});