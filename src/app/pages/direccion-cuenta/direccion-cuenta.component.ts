import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { share } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../interfaces/direccion';

@Component({
  selector: 'app-direccion-cuenta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './direccion-cuenta.component.html',
  styleUrl: './direccion-cuenta.component.css'
})
export class DireccionCuentaComponent implements OnInit {

  direcciones: Direccion[] = [];

  constructor(
    private sharedService: SharedService,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(3);
    const usuario = this.sharedService.getUsuario();
    this.direccionService.listarPorUsuario(usuario.id).subscribe({
      next: (result) => {
        if (result.status == "OK") { this.direcciones = result.data; }
      },
      error: (error) => { console.log(error); }
    });
  }

  irPaginaAnterior() { }

}
