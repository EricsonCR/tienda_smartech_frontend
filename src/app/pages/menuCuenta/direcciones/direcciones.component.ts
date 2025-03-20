import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Domicilio } from '../../../interfaces/domicilio';
import { DomicilioService } from '../../../services/domicilio.service';

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.css'
})
export class DireccionesComponent {

  usuario!: Usuario;
  domicilios: Domicilio[] = [];

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private domicilioService: DomicilioService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(3);
    this.usuario = this.sharedService.getUsuario();
    this.getUsuario(this.usuario);
  }

  getUsuario(usuario: Usuario) {
    this.usuarioService.buscarPorEmail(this.usuario.email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.usuario = result.data;
          this.domicilios = this.usuario.domicilios;
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  eliminar(id: number) {
    this.alertQuestion().then((result) => {
      if (result == "SI") {
        this.domicilioService.eliminar(id).subscribe({
          next: (result) => {
            if (result.status == "OK") {
              this.alertOK(result.message);
              this.usuario = this.sharedService.getUsuario();
              this.getUsuario(this.usuario);
            }
            else { this.alertError(result.message); }
          },
          error: (error) => { console.log(error); }
        });
      }
    });
  }

  alertQuestion(): Promise<string> {
    return Swal.fire({
      title: "Esta seguro?",
      text: "Click en el boton 'Si, quiero!' para eliminar!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cancelar !",
      confirmButtonText: "Si, quiero !"
    }).then((result) => {
      if (result.isConfirmed) { return "SI"; }
      return "NO";
    });
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2500
    });
  }

  alertError(message: string) {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error"
    });
  }
}
