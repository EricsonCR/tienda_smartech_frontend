import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css'
})
export class ArticulosComponent implements OnInit {

  productos!: Producto[];
  categorias!: Categoria[];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarProductos() {
    this.productoService.listar().subscribe({
      next: (result) => {
        this.productos = result.data;
        console.log(this.productos);
      },
      error: (error) => { }
    });
  }

  listarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (result) => {
        this.categorias = result.data;
        console.log(this.categorias);
      },
      error: (error) => { }
    });
  }

}
