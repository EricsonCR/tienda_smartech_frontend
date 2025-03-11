import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { Router, RouterLink } from '@angular/router';
import { Direccion } from '../../../interfaces/direccion';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent {
usuario!: Usuario;
  direcciones: Direccion[] = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
    this.usuarioService.buscarPorEmail(this.usuario.email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.usuario = result.data;
          this.direcciones = result.data.direcciones as Direccion[];
          this.sharedService.setUsuario(this.usuario);
        }
      },
      error: (error) => { console.log(error); }
    });
    this.sharedService.updateMenuCuenta(1);
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
}
