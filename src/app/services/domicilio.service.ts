import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';
import { Domicilio } from '../interfaces/domicilio';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {
  private url: string = environment.urlApi + "/domicilio";

  constructor(
    private http: HttpClient
  ) { }

  buscarPorId(id: number) {
    return this.http.get<ControllerResponse>(this.url + "/findById/" + id);
  }

  registrar(domicilio: Domicilio) {
    return this.http.post<ControllerResponse>(this.url + "/save", domicilio);
  }

  actualizar(domicilio: Domicilio) {
    return this.http.put<ControllerResponse>(this.url + "/update", domicilio);
  }

  eliminar(id: number) {
    return this.http.delete<ControllerResponse>(this.url + "/delete/" + id);
  }
}
