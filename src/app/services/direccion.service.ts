import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Direccion } from '../interfaces/direccion';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private url: string = environment.urlApi + "/direccion";

  constructor(
    private http: HttpClient
  ) { }

  listarPorUsuario(id: number) {
    return this.http.get<ControllerResponse>(this.url + "/listarPorUsuario/" + id);
  }

  registrar(direccon: Direccion) {
    return this.http.post<ControllerResponse>(this.url + "/registrar", direccon);
  }

  buscarPorId(id: number) {
    return this.http.get<ControllerResponse>(this.url + "/buscarPorId/" + id);
  }

  actualizar(direccion: Direccion) {
    return this.http.put<ControllerResponse>(this.url + "/actualizar", direccion);
  }

  eliminar(id: number) {
    return this.http.delete<ControllerResponse>(this.url + "/eliminar/" + id);
  }

}
