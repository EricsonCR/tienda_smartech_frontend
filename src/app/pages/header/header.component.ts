import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Carrito } from '../../interfaces/carrito';
import { Usuario } from '../../interfaces/usuario';
import { CarritoDetalle } from '../../interfaces/carrito-detalle';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  modalCarrito: boolean = false;
  carrito!: Carrito;
  usuario: Usuario = UsuarioDefault;

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
    this.carrito = this.sharedService.getCarrito();
    this.sharedService.setCarrito(this.carrito);

    this.sharedService.carrito.subscribe(
      value => { this.carrito = value; }
    );

    this.sharedService.usuario.subscribe((value) => {
      this.usuario = this.sharedService.getUsuario();
    });
  }

  logout() {
    this.sharedService.removeUsuario();
    this.sharedService.removeToken();
    this.sharedService.removeCarrito();
    this.sharedService.removePedido();
    this.router.navigate(["/auth/signin"]);
  }

  formatearNumero(numero: number): string {
    return numero.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  verCarrito() { this.modalCarrito = !this.modalCarrito; }

  totalCarrito(carritoDetalles: CarritoDetalle[]) {
    let total = 0;
    if (carritoDetalles.length > 0) {
      carritoDetalles.forEach(
        item => { total += (item.producto.precio * (1 - item.producto.descuento / 100)) * item.cantidad; }
      );
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  irAlProducto(nombre: string) {
    const modal = document.getElementById("myModal");
    if (modal) {
      const mymodal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      mymodal.hide();
    }
    this.modalCarrito = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['producto-detalle', nombre]);
    });
  }

  irAlCarrito() {
    this.modalCarrito = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(["compra/carrito"]);
    });
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.modalCarrito = false;
    }
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
}