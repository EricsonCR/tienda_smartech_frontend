import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private url: string = environment.urlApi + "/pdf";

  constructor(
    private http: HttpClient
  ) { }

  buscarPdf(numero: string) {
    return this.http.get(this.url + "/pedido/" + numero, { responseType: "blob" });
  }
}
