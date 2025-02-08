import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private cuentaSubject = new BehaviorSubject<string>("Cuenta");
  cuenta$ = this.cuentaSubject.asObservable();

  updateCuenta(value: string) {
    this.cuentaSubject.next(value);
  }
}
