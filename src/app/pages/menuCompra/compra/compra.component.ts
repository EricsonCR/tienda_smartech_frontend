import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Carrito } from '../../../interfaces/carrito';
import { CarritoDetalle } from '../../../interfaces/carrito-detalle';
import { Usuario } from '../../../interfaces/usuario';
import { SharedService } from '../../../services/shared.service';
import { Pedido } from '../../../interfaces/pedido';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent {

  menuCompra: number = 0;
  carrito: Carrito = carritoDefault;
  usuario!: Usuario;
  pedido!: Pedido;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.sharedService.pedido.subscribe((value) => {
      this.pedido = value;
    });

    this.sharedService.carrito.subscribe((value) => {
      this.carrito = value;
      if (this.carrito.carritoDetalles.length > 0) { this.acoplarCarritoPedido(); }
    });

    this.sharedService.menuCompra.subscribe(x => this.menuCompra = x);
    this.sharedService.updateMenuCompra(1);
    this.usuario = this.sharedService.getUsuario();

  }

  acoplarCarritoPedido() {
    if (this.carrito.carritoDetalles.length > 0) {
      this.pedido.pedidoDetalles = [];
      this.carrito.carritoDetalles.forEach((item) => {
        const precio = parseFloat((item.producto.precio * (1 - item.producto.descuento / 100)).toFixed(2));
        this.pedido.pedidoDetalles.push({ id: 0, producto: item.producto, cantidad: item.cantidad, precio: precio });
      });
      this.pedido.total = this.calcularSubTotalPedido();
      this.sharedService.setPedido(this.pedido);
    }
  }

  calcularSubTotalPedido(): number {
    if (this.pedido.pedidoDetalles.length > 0) {
      let subtotal = 0;
      this.pedido.pedidoDetalles.forEach(item => { subtotal += item.precio * item.cantidad; });
      return parseFloat(subtotal.toFixed(2));
    }
    return 0;
  }

  itemsCarrito(carritoDetalles: CarritoDetalle[]): number {
    if (carritoDetalles.length > 0) {
      let total: number = 0;
      carritoDetalles.forEach(item => { total += item.cantidad; });
      return total;
    }
    return 0;
  }

  subTotalPedido(): string {
    if (this.calcularSubTotalPedido() > 0) {
      return this.calcularSubTotalPedido().toLocaleString('es-US');
    }
    return "0";
  }

  totalPedido(): string {
    let total: number = this.pedido.total;
    if (this.menuCompra > 1) {
      total = parseFloat((this.pedido.total + this.pedido.precio_envio).toFixed(2));
    }
    return total.toLocaleString('es-US');
  }
}

const carritoDefault: Carrito = {
  id: 0,
  usuario: undefined!,
  carritoDetalles: []
}