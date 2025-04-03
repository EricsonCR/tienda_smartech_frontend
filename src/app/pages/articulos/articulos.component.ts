import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CarritoService } from '../../services/carrito.service';
import { FavoritoService } from '../../services/favorito.service';
import { Usuario } from '../../interfaces/usuario';
import { Favorito } from '../../interfaces/favorito';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css'
})
export class ArticulosComponent implements OnInit {

  tituloModal: string = "Tu producto ha sido añadido al carrito";
  item!: Producto;
  productos!: Producto[];
  categorias!: Categoria[];
  estadoAgregar: boolean = false;
  estadoAlertProducto: boolean = false;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private sharedService: SharedService,
    private carritoService: CarritoService,
    private favoritoService: FavoritoService
  ) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarProductos() {
    this.productoService.listar().subscribe({
      next: (result) => {
        this.productos = result.data;
      },
      error: (error) => { console.log(error); }
    });
  }

  listarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (result) => {
        this.categorias = result.data;
      },
      error: (error) => { console.log(error); }
    });
  }

  agregarFavorito(p: Producto) {
    const usuarioId: number = this.sharedService.getUsuario().id;
    const productoId = p.id;
    if (usuarioId != 0 && productoId != 0) {
      let usuario: Usuario = this.sharedService.getUsuario();
      let producto: Producto = p;
      producto.id = productoId;
      const favorito: Favorito = { id: 0, producto: producto, usuario: usuario };
      this.favoritoService.registrar(favorito).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.alertOK("Producto agregado a favoritos"); }
          else { this.alertInfo(result.message); }
        },
        error: (error) => { console.log(error); }
      });
    } else if (usuarioId == 0) {
      console.log("debe iniciar sesion para agregar favoritos");
    }
  }

  irAlProducto(nombre: string) {
    const modal = document.getElementById("myModal");
    if (modal) {
      const mymodal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      mymodal.hide();
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['producto-detalle', nombre]);
    });
  }

  irAlCarrito() {
    const modal = document.getElementById("myModal");
    if (modal) {
      const mymodal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      mymodal.hide();
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(["carrito"]);
    });
  }

  agregar(p: Producto) {
    this.item = p;
    const usuario = this.sharedService.getUsuario();

    if (usuario.email != "") {
      const id = this.sharedService.getCarrito().id;
      this.carritoService.agregarItem(id, { id: 0, producto: p, cantidad: 1 }).subscribe({
        next: (result) => {
          if (result.status == "OK") {
            this.sharedService.setCarrito(result.data);
            this.actualizarAgregar(1);
          }
          else if (result.status == "FOUND") { this.actualizarAgregar(2); }
          else { console.log(result); }
        },
        error: (error) => { console.log(error); }
      });
    }
    else {
      let itemIndex: number = 0;
      itemIndex = this.sharedService.agregarItemCarrito(p, 1);
      if (itemIndex == -1) { this.actualizarAgregar(1); }
      else { this.actualizarAgregar(2); }
    }
  }

  calcularPrecio(precio: number, descuento: number): string {
    let total: number = 0;
    total = precio * (1 - descuento / 100);
    total = parseFloat(total.toFixed(2));
    return total.toLocaleString("es-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async actualizarAgregar(mode: number) {
    if (mode == 1) { this.tituloModal = "Tu producto ha sido añadido al carrito"; }
    else if (mode == 2) { this.tituloModal = "El producto ya existe en tu carrito"; }
    else if (mode == 0) { console.log("Error al agregar item en base datos"); }
    this.estadoAgregar = false;
    await this.delay(500);
    this.estadoAgregar = true;
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  alertInfo(message: string) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: message,
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

const UsuarioDefault: Usuario = {
  id: 0,
  documento: "",
  numero: "",
  rol: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  email: "",
  nacimiento: "",
  domicilios: [],
  pedidos: [],
  favoritos: []
}

const ProductoDefault: Producto = {
  id: 0,
  sku: "",
  nombre: "",
  descripcion: "",
  slogan: "",
  stock: 0,
  precio: 0,
  descuento: 0,
  categoria: undefined!,
  marca: undefined!,
  fotos: [],
  especificaciones: []
}