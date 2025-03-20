import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../interfaces/pedido';
import Swal from 'sweetalert2';
import { PedidoService } from '../../../services/pedido.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { Carrito } from '../../../interfaces/carrito';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {

  metodo_pagos: string[] = [
    "TARJETA", "MONEDA_DIGITAL", "PAGO_EFECTIVO", "CONTRA_ENTREGA"
  ];

  opcionPago: number = 1;
  pedido!: Pedido;

  constructor(
    private sharedService: SharedService,
    private pedidoService: PedidoService,
    private carritoService: CarritoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCompra(3);
    this.pedido = this.sharedService.getPedido();
    this.pedido.fecha_entrega = this.convertirFecha(this.pedido.fecha_entrega);
    this.pedido.metodo_pago = this.metodo_pagos[0];
  }

  selectPago(index: number) {
    this.opcionPago = index;
    this.pedido.metodo_pago = this.metodo_pagos[index - 1];
  }

  totalPedido(p: Pedido): string {
    if (p.pedidoDetalles.length > 0) {
      let total: number = 0;
      p.pedidoDetalles.forEach((item) => {
        total += item.precio * item.cantidad;
      });
      total += p.precio_envio;
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  pagar() {
    Swal.fire({
      title: "Esta seguro?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cancelar !",
      confirmButtonText: "Si, quiero !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.registrar(this.pedido).subscribe({
          next: (result) => {
            if (result.status == "OK") {
              this.getCarrito();
              this.alertOK(result.message);
              this.router.navigate([""]);
            } else { console.log(result); }
          },
          error: (error) => { console.log(error); }
        });
      }
    });
  }

  getCarrito() {
    this.carritoService.buscarPorUsuario(this.pedido.usuario.id).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          const carrito: Carrito = result.data as Carrito;
          this.sharedService.setCarrito(carrito);
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  convertirFecha(fecha: string): string {
    const partes = fecha.split('/');
    const dia = partes[0].padStart(2, '0');
    const mes = partes[1].padStart(2, '0');
    const anio = partes[2];
    return `${anio}-${mes}-${dia}`;
  }

  alertOK(message: string) {
    Swal.fire({
      position: "top",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2500
    });
  }

  alertError(message: string) {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error"
    });
  }

}
