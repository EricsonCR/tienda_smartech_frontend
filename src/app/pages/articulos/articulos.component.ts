import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria';
import { Router, RouterLink } from '@angular/router';
import { Carrito } from '../../interfaces/carrito';
import { CarritoService } from '../../services/carrito.service';

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

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService
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

  agregar(p: Producto) {
    this.item = p;
    const itemIndex = this.carritoService.agregarCarrito({ producto: p, cantidad: 1 });
    if (itemIndex == -1) { this.tituloModal = "Tu producto ha sido añadido al carrito"; }
    else { this.tituloModal = "El producto ya existe en tu carrito"; }
    this.actualizarAgregar();
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async actualizarAgregar() {
    this.estadoAgregar = false;
    await this.delay(1000);
    this.estadoAgregar = true;
  }

}
