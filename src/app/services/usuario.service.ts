import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = environment.urlApi + "/usuario";

  constructor(
    private http: HttpClient
  ) { }

  buscarPorEmail(email: string) {
    return this.http.get<ControllerResponse>(this.url + "/findByEmail/" + email);
  }

  actualizar(usuario: Usuario) {
    return this.http.put<ControllerResponse>(this.url + "/update", usuario);
  }

}
