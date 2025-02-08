import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  statusLogin: boolean = false;
  usuario: Usuario = {
    id: "",
    rol: "",
    documento: "",
    numero: "",
    nombres: "Cuenta",
    apellidos: "",
    telefono: "",
    direccion: "",
    email: "",
    nacimiento: new Date()
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const email: string = this.authService.getEmail()!;
    if (email) {
      console.log("header init");
      this.sharedService.updateCuenta(email);
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          if (result.status == "200") { this.usuario = result.data; this.statusLogin = true; }
        },
        error: (error) => { console.log(error); }
      });
    }
    this.sharedService.cuenta$.subscribe(
      value => {
        if (value != "Cuenta") {
          console.log("observable");
          this.usuarioService.buscarPorEmail(value).subscribe({
            next: (result) => {
              if (result.status == "200") { this.usuario = result.data; this.statusLogin = true; }
            },
            error: (error) => { console.log(error); }
          });
        }
      }
    );
  }

  logout() {
    this.authService.removeEmail();
    this.authService.removeToken();
    this.statusLogin = false;
    this.usuario.nombres = "Cuenta";
    this.router.navigate(["/login"]);
  }
}
