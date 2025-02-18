import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Carrito } from '../../interfaces/carrito';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  statusCarrito: boolean = false;
  statusLogin: boolean = false;
  nombreCuenta: string = "Cuenta";
  cantidadCarrito: number = 0;
  subTotalCarrito: number = 0;
  precioTotal: string = "0";
  carrito: Carrito[] = [];

  constructor(
    private eRef: ElementRef,
    private usuarioService: UsuarioService,
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {

    const email: string = this.authService.getEmail()!;
    if (email) {
      this.sharedService.updateCuenta(email);
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.nombreCuenta = result.data.nombres; this.statusLogin = true; }
        },
        error: (error) => { console.log(error); }
      });
    }
    this.sharedService.cuenta$.subscribe(
      value => {
        if (value != "Cuenta") {
          this.usuarioService.buscarPorEmail(value).subscribe({
            next: (result) => {
              if (result.status == "OK") { this.nombreCuenta = result.data.nombres; this.statusLogin = true; }
            },
            error: (error) => { console.log(error); }
          });
        }
      }
    );

    this.carritoService.cargarItems();

    this.carritoService.carrito$.subscribe(() => {
      this.cantidadCarrito = this.carritoService.cantidadTotalCarrito();
      this.subTotalCarrito = this.carritoService.precioTotalCarrito();
      this.precioTotal = this.formatearNumero(this.subTotalCarrito);
      this.carrito = this.carritoService.listarCarrito();
    });

  }

  logout() {
    this.authService.removeEmail();
    this.authService.removeToken();
    this.statusLogin = false;
    this.nombreCuenta = "Cuenta";
    this.router.navigate(["/login"]);
  }

  formatearNumero(numero: number): string {
    return numero.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  verCarrito() {
    this.statusCarrito = !this.statusCarrito;
    if (this.statusCarrito) {

    }
  }

  irAlProducto(nombre: string) {
    const modal = document.getElementById("myModal");
    if (modal) {
      const mymodal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      mymodal.hide();
      this.statusCarrito = false;
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['producto-detalle', nombre]);
    });
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.statusCarrito = false;
    }
  }
}
