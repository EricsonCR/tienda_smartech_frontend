import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

export const cuentaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sharedService = inject(SharedService);
  const token = sharedService.getToken();
  if (token != "") { return true; }
  return false;
};
