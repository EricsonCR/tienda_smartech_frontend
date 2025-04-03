import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Favorito } from '../../../interfaces/favorito';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FavoritoService } from '../../../services/favorito.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../interfaces/producto';
import { CarritoService } from '../../../services/carrito.service';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  favoritos: Favorito[] = [];

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private favoritoService: FavoritoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(5);
    this.obtenerFavoritos();
  }

  agregarAlCarrito(p: Producto, favoritoId: number) {
    const usuario: Usuario = this.sharedService.getUsuario();
    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.agregarItem(id, { id: 0, producto: p, cantidad: 1 }).subscribe({
        next: (result) => {
          if (result.status == "OK") {
            this.sharedService.setCarrito(result.data);
            this.eliminarFavorito(favoritoId);
          }
          else if (result.status == "FOUND") { this.eliminarFavorito(p.id); }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  eliminarFavorito(favoritoId: number) {
    this.favoritoService.eliminar(favoritoId).subscribe({
      next: (result) => {
        if (result.status == "OK") { this.alertOK(result.message); this.ngOnInit(); }
        else { console.log(result); }
      },
      error: (error) => { console.log(error); }
    });
  }

  formatoMoneda(value: number): string {
    return value.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  calcularPrecio(precio: number, descuento: number): string {
    let total: number = precio * (1 - descuento / 100);
    return this.formatoMoneda(total);
  }

  obtenerFavoritos() {
    const email: string = this.sharedService.getUsuario().email;
    if (email != "") {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.favoritos = result.data.favoritos as Favorito[]; }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500
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
