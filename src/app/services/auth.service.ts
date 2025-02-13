import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ControllerResponse } from '../interfaces/controller-response';
import { Auth } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.urlApi + "/auth";
  constructor(
    private http: HttpClient
  ) { }

  login(auth: Auth) { return this.http.post<ControllerResponse>(this.url + "/login", auth); }
  registrar(auth: Auth) { return this.http.post<ControllerResponse>(this.url + "/registrar", auth); }
  recuperarPassword(email: string) { return this.http.get<ControllerResponse>(this.url + "/recuperarPassword/" + email); }

  getToken() { return localStorage.getItem("token"); }
  setToken(token: string) { localStorage.setItem("token", token); }
  removeToken() { localStorage.removeItem("token"); }

  getEmail() { return localStorage.getItem("email"); }
  setEmail(email: string) { localStorage.setItem("email", email); }
  removeEmail() { localStorage.removeItem("email"); }
}
