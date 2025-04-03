import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { CarritoService } from '../../services/carrito.service';

declare var bootstrap: any;

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {

  tituloModal: string = "Tu producto ha sido añadido al carrito";
  estadoAgregar: boolean = false;
  item!: Producto;
  cantidadItem: number = 1;
  activeDetalle: string = "div1";
  producto!: Producto;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private sharedService: SharedService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    const nombre = this.route.snapshot.paramMap.get("nombre")!;
    this.getProducto(nombre);
  }

  getProducto(nombre: string) {
    this.productoService.buscarPorNombre(nombre!).subscribe({
      next: (result) => { this.producto = result.data; },
      error: (error) => { }
    });
  }

  toggleDiv(div: string) { this.activeDetalle = div; }
  sumarItems() { this.cantidadItem++; }
  restarItems() { if (this.cantidadItem > 0) { this.cantidadItem--; } }

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
      this.carritoService.agregarItem(id, { id: 0, producto: p, cantidad: this.cantidadItem }).subscribe({
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
      itemIndex = this.sharedService.agregarItemCarrito(p, this.cantidadItem);
      if (itemIndex == -1) { this.actualizarAgregar(1); }
      else { this.actualizarAgregar(2); }
    }
    // this.item = p;
    // const itemIndex = this.sharedService.agregarItemCarrito(p, this.cantidadItem);
    // if (itemIndex == -1) { this.tituloModal = "Tu producto ha sido añadido al carrito"; }
    // else { this.tituloModal = "El producto ya existe en tu carrito"; }
    // this.actualizarAgregar();
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
    // this.estadoAgregar = false;
    // await this.delay(1000);
    // this.estadoAgregar = true;
  }

}