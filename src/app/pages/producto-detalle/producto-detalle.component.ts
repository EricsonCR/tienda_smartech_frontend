import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {

  producto!: Producto;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    const nombre = this.route.snapshot.paramMap.get("nombre");
    this.productoService.buscarPorNombre(nombre!).subscribe({
      next: (result) => {
        this.producto = result.data;
        console.log(this.producto);
      },
      error: (error) => { }
    });
  }

}
