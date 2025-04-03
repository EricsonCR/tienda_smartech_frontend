import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent implements OnInit {

  listaOpciones = [
    { id: 1, nombre: "Mi cuenta", ruta: "resumen" },
    { id: 2, nombre: "Mis datos", ruta: "datos" },
    { id: 3, nombre: "Mi libreta direcciones", ruta: "direccion" },
    { id: 4, nombre: "Mis pedidos", ruta: "pedidos" },
    { id: 5, nombre: "Mi lista favoritos", ruta: "favoritos" }
  ];

  opcion: number = 0;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.menuCuenta.subscribe(x => this.opcion = x);
  }

  seleccionarOpcion(op: number) {
    this.opcion = op;
  }
  logout() {
    this.sharedService.removeUsuario();
    this.sharedService.removeToken();
    this.sharedService.removeCarrito();
    this.sharedService.removePedido();
    this.router.navigate(["/auth/signin"]);
  }
}
