import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './validar.component.html',
  styleUrl: './validar.component.css'
})
export class ValidarComponent implements OnInit {

  email: string = "";
  mensaje: string = "";
  opcionValidacion: number = 3;
  estadoReenviar: boolean = false;
  estadoRespuesta: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token: string = this.activatedRoute.snapshot.paramMap.get("token") || "";
    if (token !== null && token != undefined) {
      this.authService.validarRegistro(token).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.opcionValidacion = 1; }
          else if (result.status == "CONFLICT") { this.opcionValidacion = 2; }
          else if (result.status == "BAD_REQUEST") { this.opcionValidacion = 3; }
          this.mensaje = result.message;
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  reenviarEmail() {
    if (this.email != "" && this.email.includes("@") && this.email.includes(".com")) {
      this.estadoReenviar = true;
      this.authService.enviarEmailRegistro(this.email).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.estadoRespuesta = true; }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

}
