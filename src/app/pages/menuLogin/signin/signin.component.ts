import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { SharedService } from '../../../services/shared.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { CarritoService } from '../../../services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  public authForm!: FormGroup;
  private usuario!: Usuario;

  email: string = "";
  opcionReenviar: number = 0;
  estadoReenviar: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }

  reenviarEmail() {
    if (this.email != "" && this.email.includes("@") && this.email.includes(".com")) {
      this.estadoReenviar = true;
      this.authService.enviarEmailRegistro(this.email).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.opcionReenviar = 2; }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  login() {
    this.authService.login(this.authForm.value).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.actualizarUsuario(this.authForm.value.email);
          this.alertOK(result.message);
        } else if (result.status == "CONFLICT") {
          this.opcionReenviar = 1;
        } else {
          this.alertError(result.message);
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  actualizarUsuario(email: string) {
    this.usuarioService.buscarPorEmail(email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.usuario = result.data;
          if (this.usuario.email != "") {
            this.sharedService.setUsuario(this.usuario);
            this.actualizarCarrito(this.usuario.id);
            this.router.navigate([""]);
          }
        } else { this.alertError(result.message); }
      },
      error: (error) => { console.log(error); }
    });
  }

  actualizarCarrito(id: number) {
    const carrito = this.sharedService.getCarrito();
    if (carrito.carritoDetalles.length > 0) {
      carrito.usuario = this.usuario;
      this.carritoService.actualizar(carrito).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
          else { this.alertError(result.message); }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.carritoService.buscarPorUsuario(id).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.sharedService.setCarrito(result.data); }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  irIniciarSesion() {
    this.opcionReenviar = 0;
    this.authForm.reset();
  }

  alertOK(message: string) {
    Swal.fire({
      position: "top",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  alertError(message: string) {
    Swal.fire({
      position: "top",
      title: message,
      icon: "error"
    });
  }

}