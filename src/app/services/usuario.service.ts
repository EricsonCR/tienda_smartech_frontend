import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = environment.urlApi + "/usuario";
  
  constructor(
    private http: HttpClient
  ) { }

  buscarPorEmail(email: string) {
    return this.http.get<ControllerResponse>(this.url + "/buscarPorEmail/" + email);
  }

}
