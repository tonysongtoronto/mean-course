import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  if (authToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authRequest);
  }

  return next(req);
};
