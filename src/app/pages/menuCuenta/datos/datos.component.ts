import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../interfaces/usuario';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { SharedService } from '../../../services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {
  usuario!: Usuario;
  userForm!: FormGroup;
  nacimientoUsuario: string = "";

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initUserForm(usuarioDefault);
    this.getUsuario();
    this.sharedService.updateMenuCuenta(2);
  }

  getUsuario() {
    const email = this.sharedService.getUsuario().email;
    if (email != "") {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          this.usuario = result.data;
          this.usuario.nacimiento = this.formatoFecha(result.data.nacimiento);
          this.initUserForm(this.usuario);
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

  actualizarUsuario() {
    if (this.userForm.valid) {
      this.usuarioService.actualizar(this.userForm.value).subscribe({
        next: (result) => {
          if (result.status == "OK") this.alertOK(result.message);
          else this.alertError(result.message);
        },
        error: (error) => { console.log(error); }
      });
    }
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

  initUserForm(usuario: Usuario) {
    this.userForm = this.fb.group({
      email: [usuario.email, [Validators.required, Validators.email]],
      nombres: [usuario.nombres, [Validators.required]],
      apellidos: [usuario.apellidos, [Validators.required]],
      documento: [usuario.documento, [Validators.required]],
      numero: [usuario.numero, [Validators.required]],
      nacimiento: [usuario.nacimiento, [Validators.required]],
      telefono: [usuario.telefono, [Validators.required]],
    });
  }

}

const usuarioDefault: Usuario = {
  id: 0,
  rol: "",
  documento: "",
  numero: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  direccion: "",
  email: "",
  nacimiento: "",
  domicilios: [],
  pedidos: [],
  favoritos: []
};