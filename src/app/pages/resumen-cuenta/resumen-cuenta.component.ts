import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { SharedService } from '../../services/shared.service';
import { Direccion } from '../../interfaces/direccion';
import { DireccionService } from '../../services/direccion.service';

@Component({
  selector: 'app-resumen-cuenta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resumen-cuenta.component.html',
  styleUrl: './resumen-cuenta.component.css'
})
export class ResumenCuentaComponent implements OnInit {

  usuario!: Usuario;
  direcciones: Direccion[] = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
    this.direccionService.listarPorUsuario(this.usuario.id).subscribe({
      next: (result) => {
        if (result.status == "OK") { this.direcciones = result.data; }
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
