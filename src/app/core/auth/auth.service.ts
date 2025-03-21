import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private authUrl = '/api/UserApp';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(emailId: string, password: string): Observable<boolean> {
    return this.http
      .post(`${this.authUrl}/login`, { EmailId: emailId, Password: password })
      .pipe(
        map((res: any) => {
          
          if (res?.token) {
            localStorage.setItem('authToken', res.token);
          }
          return true;
        })
      );
  }

  // SIGNUP
  signup(emailId: string, password: string): Observable<boolean> {
    return this.http
      .post(`${this.authUrl}/CreateNewUser`, {
        userId: 0,
        emailId,         
        fullName: emailId, 
        password
      })
      .pipe(
        map((res: any) => {
          // If the backend returns a token, store it:
          if (res?.token) {
            localStorage.setItem('authToken', res.token);
          }
          return true;
        })
      );
  }
}
