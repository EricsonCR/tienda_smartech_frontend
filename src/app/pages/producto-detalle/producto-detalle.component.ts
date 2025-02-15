import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {

  activeDetalle: string = "div1";
  producto!: Producto;

  constructor(
    private router: Router,
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

  toggleDiv(div: string) { this.activeDetalle = div; }

}
