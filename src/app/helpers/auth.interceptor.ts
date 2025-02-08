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
    console.log("token agregado");
    req = req.clone({
      setHeaders: { Authorization: "Bearer " + token }
    });
  }
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log("response");
        const token = event.headers.get('Authorization')?.substring(7)!;
        if (token != "null" && token != undefined) {
          console.log("token exists");
          authService.setToken(token);
        }
      }
    })
  );
};
