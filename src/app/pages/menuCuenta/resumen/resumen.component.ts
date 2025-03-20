import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../interfaces/pedido';
import { Domicilio } from '../../../interfaces/domicilio';
import { PdfService } from '../../../services/pdf.service';

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

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
    this.usuarioService.buscarPorEmail(this.usuario.email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.usuario = result.data;
          this.domicilios = result.data.domicilios as Domicilio[];
          this.pedidos = result.data.pedidos as Pedido[];
          this.sharedService.setUsuario(this.usuario);
        }
      },
      error: (error) => {
        if (error.status == "403") {
          this.sharedService.removeToken();
          this.sharedService.removeUsuario();
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
    return value.toLocaleString('es-US');
  }
}
