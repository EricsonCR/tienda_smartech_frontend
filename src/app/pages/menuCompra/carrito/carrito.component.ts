import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { Carrito } from '../../../interfaces/carrito';
import { Producto } from '../../../interfaces/producto';
import Swal from 'sweetalert2';
import { Usuario } from '../../../interfaces/usuario';
import { SharedService } from '../../../services/shared.service';
import { FavoritoService } from '../../../services/favorito.service';
import { Favorito } from '../../../interfaces/favorito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  carrito!: Carrito;
  cantidad: number = 0;
  total: number = 0;
  subtotal: number = 0;
  descuento: number = 0;
  usuario!: Usuario;

  constructor(
    private carritoService: CarritoService,
    private sharedService: SharedService,
    private favoritoService: FavoritoService
  ) { }

  ngOnInit(): void {

    this.sharedService.carrito.subscribe((value) => {
      this.carrito = value;
    });
    this.sharedService.updateMenuCompra(1);
    this.usuario = this.sharedService.getUsuario();

  }

  formatoMoneda(value: number): string {
    return value.toLocaleString("es-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  obtenerPrecio(producto: Producto): string {
    let total = parseFloat((producto.precio * (1 - producto.descuento / 100)).toFixed(2));
    return this.formatoMoneda(total);
  }

  sumarItems(p: Producto) {
    const usuario = this.sharedService.getUsuario();
    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.sumartItem(id, { id: 0, producto: p, cantidad: 1 }).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
          else if (result.status == "NOT_FOUND") { }
          else { }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.sharedService.sumarItemCarrito(p);
      this.carrito = this.sharedService.getCarrito();
    }
  }

  restarItems(p: Producto) {
    const usuario = this.sharedService.getUsuario();
    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.restarItem(id, { id: 0, producto: p, cantidad: 1 }).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
          else if (result.status == "NOT_FOUND") { }
          else { }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.sharedService.restarItemCarrito(p);
      this.carrito = this.sharedService.getCarrito();
    }
  }

  eliminarItem(p: Producto) {
    const usuario = this.sharedService.getUsuario();
    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.eliminarItem(id, { id: 0, producto: p, cantidad: 0 }).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.sharedService.eliminarItemCarrito(p);
      this.carrito = this.sharedService.getCarrito();
    }
  }

  guardarItem(p: Producto) {
    const usuarioId: number = this.sharedService.getUsuario().id;
    const productoId = p.id;
    if (usuarioId != 0 && productoId != 0) {
      let usuario: Usuario = this.sharedService.getUsuario();
      let producto: Producto = p;
      producto.id = productoId;
      const favorito: Favorito = { id: 0, producto: producto, usuario: usuario };
      this.favoritoService.registrar(favorito).subscribe({
        next: (result) => {
          if (result.status == "OK" || result.status == "FOUND") {
            this.eliminarItem(p);
            this.alertOK(result.message);
          }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    } else if (usuarioId == 0) {
      console.log("debe iniciar sesion para agregar favoritos");
    }
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
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
