import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Favorito } from '../interfaces/favorito';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private url: string = environment.urlApi + "/favorito";

  constructor(
    private http: HttpClient
  ) { }

  registrar(favorito: Favorito) {
    return this.http.post<ControllerResponse>(this.url + "/create", favorito);
  }

  eliminar(id: number) {
    return this.http.delete<ControllerResponse>(this.url + "/delete/" + id);
  }

}
