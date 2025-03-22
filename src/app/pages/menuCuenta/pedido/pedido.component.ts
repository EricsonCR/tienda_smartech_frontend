import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../interfaces/pedido';
import { Usuario } from '../../../interfaces/usuario';
import { Direccion } from '../../../interfaces/direccion';
import { Consignatario } from '../../../interfaces/consignatario';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {

  pedido: Pedido = PedidoDefault;
  estadoPedido: number = 0;

  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private pedidoService: PedidoService,
    private pdfService: PdfService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(4);
    this.buscarPedido();
  }

  obtenerEstado() {
    if (this.pedido.estado != "") {
      switch (this.pedido.estado) {
        case "GENERADO": this.estadoPedido = 1; break;
        case "APROBADO": this.estadoPedido = 2; break;
        case "ENVIADO": this.estadoPedido = 3; break;
        case "ENTREGADO": this.estadoPedido = 4; break;
        default: this.estadoPedido = 0; break;
      }
    }
  }

  buscarPedido() {
    const value = this.activatedRoute.snapshot.paramMap.get("id");
    if (value != null) {
      const id: number = Number(value);
      if (id > 0) {
        this.pedidoService.buscarPorId(id).subscribe({
          next: (result) => {
            if (result.status == "OK") {
              this.pedido = result.data;
              this.obtenerEstado();
            }
            else { console.log(result); }
          },
          error: (error) => { console.log(error); }
        });
      }
    }
  }

  verComprobante(numero: string) {
    this.pdfService.buscarPdf(numero).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      },
      error: (error) => { console.log(error); }
    });
  }

  formatoMoneda(value: number): string {
    value = parseFloat(value.toFixed(2));
    return value.toLocaleString('es-US');
  }

  formatoFecha(fecha: string): string {
    if (fecha == null) return "";
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}

const UsuarioDefault: Usuario = {
  id: 0,
  rol: "",
  documento: "",
  numero: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  email: "",
  nacimiento: "",
  domicilios: [],
  pedidos: []
};

const DireccionDefault: Direccion = {
  id: 0,
  numero: "",
  via: "",
  nombre: "",
  referencia: "",
  distrito: " ",
  provincia: "",
  departamento: "",
  codigo_postal: 0,
};

const ConsignatarioDetault: Consignatario = {
  id: 0,
  documento: "",
  numero: "",
  nombres: "",
  celular: "",
  email: ""
}

const PedidoDefault: Pedido = {
  id: 0,
  numero: "",
  estado: "GENERADO",
  usuario: UsuarioDefault,
  entrega: "DELIVERY",
  consignatario: ConsignatarioDetault,
  direccion: DireccionDefault,
  metodo_pago: "",
  precio_envio: 0,
  precio_cupon: 0,
  total: 0,
  igv: 0,
  comentarios: "",
  fecha_entrega: "",
  pedidoDetalles: []
};