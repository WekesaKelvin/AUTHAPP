import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpHeaders } from '@angular/common/http';



interface ApiAuthResponse {
  jwtToken: string;
}

interface UserDTO {
  id: number;
  name: string;
  email: string;
}

interface User {
  id: number;
  email: string;
  fullName: string;
  roles?: string[];
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080';
  private tokenKey = 'authToken';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const user: User = {
          id: decodedToken.nameid || 0, 
          email: decodedToken.sub || '', 
          fullName: decodedToken.name || '',
          roles: decodedToken.role ? (Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]) : [],
          token: token
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem(this.tokenKey); 
      }
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid || 0,
      fullName: decodedToken.name || '',
      email: decodedToken.sub || '',
      roles: decodedToken.role || []
    };
    return userDetail;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<ApiAuthResponse>(`${this.apiUrl}/authenticate`, data)
      .pipe(
        map(response => {
          const token = response.jwtToken;
          if (token) {
            sessionStorage.setItem(this.tokenKey, token);
            const decodedToken: any = jwtDecode(token);
            const user: User = {
              id: decodedToken.nameid || 0,
              email: decodedToken.sub || '',
              fullName: decodedToken.name || '',
              roles: decodedToken.role ? (Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]) : [],
              token: token
            };
            this.currentUserSubject.next(user);
            return { isSuccess: true, token };
          } else {
            throw new Error('Token not found in response');
          }
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  signup(name: string, email: string, password: string): Observable<boolean> {
    return this.http
      .post<UserDTO>(`${this.apiUrl}/sign-up`, { name, email, password })
      .pipe(
        map(res => {
          if (res && res.id) {
            
            return true;
          } else {
            throw new Error('Signup failed');
          }
        }),
        catchError(error => {
          console.error('Signup failed:', error);
          return throwError(() => new Error('Signup failed'));
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey); 
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<string> {
    
    const params = new HttpParams().set('email', email);
    return this.http
      .post<string>(`${this.apiUrl}/forgot-password`, {}, { params })
      .pipe(
        map(() => 'Password reset link sent successfully. Please check your email.'),
        catchError(error => {
          console.error('Forgot Password request failed:', error);
          return throwError(() => new Error('Password reset request failed. Please try again.'));
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    
    const params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);
      
    return this.http
      .post<string>(`${this.apiUrl}/reset-password`, {}, { params })
      .pipe(
        map(() => 'Password reset successfully.'),
        catchError(error => {
          console.error('Reset Password request failed:', error);
          return throwError(() => new Error('Invalid or expired token.'));
        })
      );
  }
  

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}