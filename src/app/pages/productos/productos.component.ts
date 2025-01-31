import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  constructor(
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (result) => { console.log(result); },
      error: (error) => { console.log(error); }
    });
  }

}
