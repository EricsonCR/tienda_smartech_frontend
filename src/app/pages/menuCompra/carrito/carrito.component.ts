import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { Carrito } from '../../../interfaces/carrito';
import { Producto } from '../../../interfaces/producto';
import Swal from 'sweetalert2';
import { Usuario } from '../../../interfaces/usuario';
import { SharedService } from '../../../services/shared.service';

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
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.sharedService.carrito.subscribe((value) => {
      this.carrito = this.sharedService.getCarrito();
    });
    this.sharedService.updateMenuCompra(1);
    this.usuario = this.sharedService.getUsuario();

  }

  sumarItems(p: Producto) {
    const usuario = this.sharedService.getUsuario();
    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.sumartItem(id, { id: 0, producto: p, cantidad: 1 }).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
          else if (result.status == "NOT_FOUND") { }
          else { console.log(result); }
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
          else { console.log(result); }
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
          else if (result.status == "NOT_FOUND") { }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.sharedService.eliminarItemCarrito(p);
      this.carrito = this.sharedService.getCarrito();
    }
  }

  realiarPedido() {
    Swal.fire({
      title: "Esta seguro?",
      text: "Click en el boton SI para realizar el pedido!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cancelar !",
      confirmButtonText: "Si, quiero !"
    }).then((result) => {
      if (result.isConfirmed) {
        // let carrito = this.sharedService.getCarrito();
        // carrito.usuario = this.sharedService.getUsuario();
        // console.log(carrito);
        // this.carritoService.registrar(carrito).subscribe({
        //   next: (result) => {
        //     if (result.status == "OK") { this.alertOK(result.message); }
        //     else { this.alertError(result.message); }
        //   },
        //   error: (error) => { console.log(error); }
        // });
      }
    });
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
