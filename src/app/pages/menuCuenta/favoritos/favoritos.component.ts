import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Favorito } from '../../../interfaces/favorito';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  favoritos: Favorito[] = [];

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCuenta(5);
    this.obtenerFavoritos();
  }

  obtenerFavoritos() {
    const email: string = this.sharedService.getUsuario().email;
    if (email != "") {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.favoritos = result.data.favoritos as Favorito[]; }
          console.log(this.favoritos);
        },
        error: (error) => { console.log(error); }
      });
    }
  }
}
