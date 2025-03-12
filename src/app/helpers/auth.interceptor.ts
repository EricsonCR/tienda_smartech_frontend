import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { SharedService } from '../services/shared.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const urlsRequiringAuth = [
    "/api/carrito",
    "/api/usuario",
    "/api/direccion",
    "/api/pedido"
  ];

  const isAuthUrl = urlsRequiringAuth.some(url => req.url.includes(url));

  const sharedService = inject(SharedService);
  const token = sharedService.getToken();

  if (token && isAuthUrl) {
    req = req.clone({
      setHeaders: { Authorization: "Bearer " + token }
    });
  }
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const token = event.headers.get('Authorization')?.substring(7)!;
        if (token != "null" && token != undefined) {
          sharedService.setToken(token);
        }
      }
    })
  );
};
