import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Carrito } from '../../interfaces/carrito';
import { Usuario } from '../../interfaces/usuario';
import { CarritoDetalle } from '../../interfaces/carrito-detalle';
import { Producto } from '../../interfaces/producto';
import { CarritoService } from '../../services/carrito.service';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  mostrarPopup: boolean = false;
  mostrarMenu: boolean = false;

  carrito!: Carrito;
  usuario: Usuario = UsuarioDefault;

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private sharedService: SharedService,
    private carritoService: CarritoService
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

  obtenerNombreUsuario(): string {
    return this.usuario.nombres.toString().split(" ")[0];
  }

  obtenerTotalItems(items: CarritoDetalle[]) {
    return items.length;
  }

  calcularPrecio(precio: number, descuento: number): string {
    let total: number = 0;
    total = precio * (1 - descuento / 100);
    total = parseFloat(total.toFixed(2));
    return total.toLocaleString("es-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  calcularTotal(carritoDetalles: CarritoDetalle[]) {
    let total = 0;
    if (carritoDetalles.length > 0) {
      carritoDetalles.forEach(
        item => { total += (item.producto.precio * (1 - item.producto.descuento / 100)) * item.cantidad; }
      );
      total = parseFloat(total.toFixed(2));
      return total.toLocaleString("es-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  irAlProducto(nombre: string) {
    const modal = document.getElementById("myModal");
    if (modal) {
      const mymodal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      mymodal.hide();
    }
    this.mostrarPopup = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['producto-detalle', nombre]);
    });
  }

  irAlCarrito() {
    this.mostrarPopup = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(["compra/carrito"]);
    });
  }

  eliminarItem(p: Producto) {
    const email: string = this.sharedService.getUsuario().email;
    if (email != "") {
      console.log("eliminar en bd y local storage");
      const id: number = this.sharedService.getCarrito().id;
      this.carritoService.eliminarItem(id, { id: 0, producto: p, cantidad: 0 }).subscribe({
        next: (result) => {
          if (result.status == "OK") {
            this.carrito = result.data as Carrito;
            this.sharedService.setCarrito(this.carrito);
          }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });

    } else {
      console.log("eliminar en local storage");
      this.sharedService.eliminarItemCarrito(p);
      this.carrito = this.sharedService.getCarrito();
    }
  }

  togglePopup(event: Event, car: Carrito) {
    if (car.carritoDetalles.length == 0) { return; }
    event.preventDefault();
    event.stopPropagation();
    this.mostrarPopup = !this.mostrarPopup;

    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('show');
    });
  }

  toggleMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.mostrarMenu = !this.mostrarMenu;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }
  cerrarMenu() {
    this.mostrarMenu = false;
  }


  @HostListener('document:click', ['$event'])
  cerrarSiClickFuera(event: Event) {
    const menu = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const popup = document.querySelector('.popup-carrito');

    if (this.mostrarPopup && popup && !popup.contains(event.target as Node)) {
      this.cerrarPopup();
    }
    if (this.mostrarMenu && menu && !menu.contains(event.target as Node) && event.target !== navbarToggler) {
      this.cerrarMenu();
    }

  }

  cerrarNavbar() {
    this.mostrarMenu = false;
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
  pedidos: [],
  favoritos: []
}