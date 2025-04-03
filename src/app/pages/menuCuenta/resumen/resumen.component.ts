import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../interfaces/pedido';
import { Domicilio } from '../../../interfaces/domicilio';
import { PdfService } from '../../../services/pdf.service';
import { Favorito } from '../../../interfaces/favorito';
import { FavoritoService } from '../../../services/favorito.service';
import Swal from 'sweetalert2';
import { CarritoService } from '../../../services/carrito.service';
import { Producto } from '../../../interfaces/producto';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent {

  usuario!: Usuario;
  domicilios: Domicilio[] = [];
  pedidos: Pedido[] = [];
  favoritos: Favorito[] = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private pdfService: PdfService,
    private favoritoService: FavoritoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
    this.usuarioService.buscarPorEmail(this.usuario.email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.usuario = result.data;
          this.domicilios = result.data.domicilios as Domicilio[];
          this.pedidos = result.data.pedidos as Pedido[];
          this.favoritos = result.data.favoritos as Favorito[];
          this.sharedService.setUsuario(this.usuario);
        }
      },
      error: (error) => {
        if (error.status == "403") {
          this.sharedService.removeToken();
          this.sharedService.removeUsuario();
          this.sharedService.removeCarrito();
          this.sharedService.removePedido();
          this.router.navigate(["/auth/signin"]);
        }
      }
    });
    this.sharedService.updateMenuCuenta(1);
  }

  ver_pdf(numero: string) {
    this.pdfService.buscarPdf(numero).subscribe({
      next: (result: Blob) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      },
      error: (error) => { console.log(error); }
    });
  }

  agregarAlCarrito(favoritoId: number, p: Producto) {
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

  irMisDatos() {
    this.router.navigate(["/cuenta/datos"]);
  }

  formatoFecha(fecha: string): string {
    if (fecha == null) return "";
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  formatoMoneda(value: number): string {
    return value.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  calcularPrecio(precio: number, descuento: number): string {
    let total: number = precio * (1 - descuento / 100);
    return this.formatoMoneda(total);
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
