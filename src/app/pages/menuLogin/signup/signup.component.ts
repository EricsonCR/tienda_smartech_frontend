import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  listaDocumentos = [
    { value: "DNI" },
    { value: "CE" },
    { value: "PASAPORTE" }
  ];

  userForm!: FormGroup;
  estadoRegistro: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      documento: ["DNI", [Validators.required]],
      numero: ["", [Validators.required]],
      nombres: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }

  registrar() {
    this.estadoRegistro = true;
    this.authService.registrar(this.userForm.value).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.alertOK(result.message);
          this.router.navigate([""]);
        }
        else { this.alertError(result.message); }
        this.estadoRegistro = false;
      },
      error: (error) => { console.log(error); }
    });
  }

  alertOK(message: string) {
    Swal.fire({
      position: "top",
      icon: "success",
      title: message,
      text: "Se envio un mensaje a su email para confirmar su datos. Por favor verificar para completar su registro",
      //showConfirmButton: false,
      // timer: 2500
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
