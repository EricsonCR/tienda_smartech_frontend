import { Injectable } from '@angular/core';
import { Carrito } from '../interfaces/carrito';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private url = environment.urlApi + "/carrito";

  constructor(
    private http: HttpClient
  ) { }

  registrar(carrito: Carrito) {
    return this.http.post<ControllerResponse>(this.url + "/registrar", carrito);
  }

  buscarPorUsuario(id: number) {
    return this.http.get<ControllerResponse>(this.url + "/buscarPorUsuario/" + id);
  }

}
