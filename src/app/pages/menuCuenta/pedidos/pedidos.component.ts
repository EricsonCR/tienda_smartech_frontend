import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Pedido } from '../../../interfaces/pedido';
import { Usuario } from '../../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[] = [];

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(4);
    this.listarPedidos();
  }

  listarPedidos() {
    const email = this.sharedService.getUsuario().email;
    if (email != "") {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          if (result.status == "OK") {
            this.pedidos = (result.data as Usuario).pedidos;
          } else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    }
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
    value = parseFloat(value.toFixed(2));
    return value.toLocaleString('es-US');
  }

}
