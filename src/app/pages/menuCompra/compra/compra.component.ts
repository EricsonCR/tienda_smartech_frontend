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
      this.carrito = this.sharedService.getCarrito();
    });
    this.sharedService.menuCompra.subscribe(x => this.menuCompra = x);
    this.sharedService.updateMenuCompra(1);
    this.usuario = this.sharedService.getUsuario();

  }

  itemsCarrito(carritoDetalles: CarritoDetalle[]): number {
    if (carritoDetalles.length > 0) {
      let total: number = 0;
      carritoDetalles.forEach(
        item => { total += item.cantidad; }
      );
      return total;
    }
    return 0;
  }

  subTotalConDescuento(carritoDetalles: CarritoDetalle[]): string {
    if (carritoDetalles.length > 0) {
      let total: number = 0;
      carritoDetalles.forEach(
        item => { total += (item.producto.precio * (1 - item.producto.descuento / 100)) * item.cantidad; }
      );
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  subTotalCarrito(carritoDetalles: CarritoDetalle[]): string {
    if (carritoDetalles.length > 0) {
      let total: number = 0;
      carritoDetalles.forEach(
        item => { total += item.producto.precio * item.cantidad; }
      );
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  descuentoCarrito(carritoDetalles: CarritoDetalle[]): string {
    if (carritoDetalles.length > 0) {
      let descuento: number = 0;
      carritoDetalles.forEach(
        item => { descuento += (item.producto.precio * (item.producto.descuento / 100)) * item.cantidad; }
      );
      return descuento.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  totalCarrito(carritoDetalles: CarritoDetalle[]): string {
    if (carritoDetalles.length > 0) {
      let total: number = 0;
      carritoDetalles.forEach(
        item => { total += (item.producto.precio * (1 - item.producto.descuento / 100)) * item.cantidad; }
      );
      total += this.pedido.precio_envio;
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }
}

const carritoDefault: Carrito = {
  id: 0,
  usuario: undefined!,
  carritoDetalles: []
}