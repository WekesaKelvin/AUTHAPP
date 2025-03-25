import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject<AuthService>(AuthService);
  const token = authService.getToken(); 

  const clonedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  console.log(`HTTP Request: ${clonedReq.method} ${clonedReq.url}`, clonedReq);

  return next(clonedReq).pipe(
    tap({
      next: (event) => console.log(`HTTP Response from ${clonedReq.url}`, event),
      error: (error) => console.error(`HTTP Error from ${clonedReq.url}`, error)
    })
  );
};

