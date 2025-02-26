import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = environment.urlApi + "/producto";
  constructor(
    private http: HttpClient
  ) { }

  listar() { return this.http.get<ControllerResponse>(this.url + "/listar"); }
  buscarPorNombre(nombre: string) { return this.http.get<ControllerResponse>(this.url + "/buscarPorNombre/" + nombre); }

}
