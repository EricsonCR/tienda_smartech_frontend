import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-datos-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datos-cuenta.component.html',
  styleUrl: './datos-cuenta.component.css'
})
export class DatosCuentaComponent implements OnInit {

  usuario!: Usuario;
  userForm!: FormGroup;
  nacimientoUsuario: string = "";

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initUserForm();
    this.initUsuario();
    this.getUsuario();
    this.sharedService.updateMenuCuenta(2);
  }

  getUsuario() {
    const email = this.sharedService.getUsuario().email;
    if (email != "") {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          this.usuario = result.data;
          this.cargarUserForm(this.usuario);
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

  irPaginaAnterior() {
    this.sharedService.updateMenuCuenta(1);
    this.router.navigate(["/cuenta/resumen"]);
  }

  actualizarUsuario() {
    if (this.userForm.valid && this.usuario.email != "") {
      this.usuarioService.actualizar(this.userForm.value, this.usuario.email).subscribe({
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

  initUserForm() {
    this.userForm = this.fb.group({
      nombres: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      documento: ["", [Validators.required]],
      numero: ["", [Validators.required]],
      nacimiento: ["", [Validators.required]],
      telefono: ["", [Validators.required]],
    });
  }

  cargarUserForm(user: Usuario) {
    this.userForm.setValue({
      nombres: user.nombres,
      apellidos: user.apellidos,
      documento: user.documento,
      numero: user.numero,
      nacimiento: this.formatoFecha(user.nacimiento),
      telefono: user.telefono
    });
  }

  initUsuario() {
    this.usuario = {
      id: 0,
      rol: "",
      documento: "",
      numero: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      email: "",
      nacimiento: ""
    };
  }

}
