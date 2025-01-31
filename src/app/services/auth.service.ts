import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ControllerResponse } from '../interfaces/controller-response';
import { Auth } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.urlAuth;
  constructor(
    private http: HttpClient
  ) { }

  login(auth: Auth) {
    return this.http.post<ControllerResponse>(this.url + "/login", auth);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }
}
