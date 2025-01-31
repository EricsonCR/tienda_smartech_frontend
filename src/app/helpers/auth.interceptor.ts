import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const urlsRequiringAuth = [
    "/api/usuario",
    '/api/venta',
    "/api/categoria",
    "/api/despacho",
    "/api/courier",
    "/api/enum",
  ];

  const isAuthUrl = urlsRequiringAuth.some(url => req.url.includes(url));
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && isAuthUrl) {
    req = req.clone({
      setHeaders: { Authorization: "Bearer " + token }
    });
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const authHeader = event.headers.get('Authorization'); // Lee el encabezado Authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          authService.setToken(authHeader.substring(7));
        }
      }
    })
  );
};
