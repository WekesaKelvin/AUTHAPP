import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';

interface AuthResponseDto {
  UserId: number;
  FullName: string;
  Token: string;
}

interface User {
  id: number;
  email: string;
  fullName: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authUrl = `${this.apiUrl}account`;

  private tokenKey = 'authToken';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const user: User = {
          id: decodedToken.nameid,
          email: decodedToken.email,
          fullName: decodedToken.name,
          token: token
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };
    return userDetail;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Login method
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/login`, data)
      .pipe(
        map(response => {
          if (response.isSuccess && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            const decodedToken: any = jwtDecode(response.token);
            const user: User = {
              id: decodedToken.nameid,
              email: decodedToken.email,
              fullName: decodedToken.name,
              token: response.token
            };
            this.currentUserSubject.next(user);
          }
          return response;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  // Signup method
  signup(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponseDto>(`${this.authUrl}/register`, {
        Email: email,
        FullName: email, // adjust later to actual fullname input
        Password: password
      })
      .pipe(
        map(res => {
          if (res?.Token) {
            localStorage.setItem(this.tokenKey, res.Token);
            const user: User = {
              id: res.UserId || 0,
              email: email,
              fullName: res.FullName || email,
              token: res.Token
            };
            this.currentUserSubject.next(user);
            return true;
          } else {
            throw new Error('Signup failed: Token not found');
          }
        }),
        catchError(error => {
          console.error('Signup failed:', error);
          return throwError(() => new Error('Signup failed'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<string> {
    return this.http
      .post<any>(`${this.authUrl}/forgot-password`, { Email: email })
      .pipe(
        map(res => {
          if (res?.Message) {
            return res.Message;
          } else {
            throw new Error('Unexpected response from server');
          }
        }),
        catchError(error => {
          console.error('Forgot Password request failed:', error);
          return throwError(() => new Error('Password reset request failed. Please try again.'));
        })
      );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
