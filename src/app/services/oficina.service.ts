import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ControllerResponse } from '../interfaces/controller-response';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {
  private url: string = environment.urlApi + "/oficina";

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<ControllerResponse>(this.url + "/listAll");
  }
}
