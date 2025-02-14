import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url: string = environment.urlApi + "/categoria";
  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<ControllerResponse>(this.url + "/listar");
  }
}
