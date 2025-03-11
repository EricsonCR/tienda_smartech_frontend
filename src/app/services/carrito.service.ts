import { Injectable } from '@angular/core';
import { Carrito } from '../interfaces/carrito';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';
import { environment } from '../../environments/environment.development';
import { CarritoDetalle } from '../interfaces/carrito-detalle';

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

  actualizar(carrito: Carrito) {
    return this.http.put<ControllerResponse>(this.url + "/actualizar", carrito);
  }

  agregarItem(id: number, carritoDetalle: CarritoDetalle) {
    return this.http.post<ControllerResponse>(this.url + "/agregarItem/" + id, carritoDetalle);
  }

  eliminarItem(id: number, carritoDetalle: CarritoDetalle) {
    return this.http.post<ControllerResponse>(this.url + "/eliminarItem/" + id, carritoDetalle);
  }

  sumartItem(id: number, carritoDetalle: CarritoDetalle) {
    return this.http.post<ControllerResponse>(this.url + "/sumarItem/" + id, carritoDetalle);
  }

  restarItem(id: number, carritoDetalle: CarritoDetalle) {
    return this.http.post<ControllerResponse>(this.url + "/restarItem/" + id, carritoDetalle);
  }
}
