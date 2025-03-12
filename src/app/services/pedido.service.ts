import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Pedido } from '../interfaces/pedido';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url: string = environment.urlApi + "/pedido";

  constructor(
    private http: HttpClient
  ) { }

  registrar(pedido: Pedido) {
    return this.http.post<ControllerResponse>(this.url + "/registrar", pedido);
  }
}
