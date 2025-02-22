import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-resumen-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-cuenta.component.html',
  styleUrl: './resumen-cuenta.component.css'
})
export class ResumenCuentaComponent implements OnInit {

  usuario!: Usuario;

  constructor(
    private router: Router,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.sharedService.getUsuario();
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
