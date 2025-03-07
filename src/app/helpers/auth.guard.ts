import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (localStorage.getItem("token") != "null" && localStorage.getItem("token") != undefined) {
    router.navigate([""]);
    return false;
  }
  return true;
};
