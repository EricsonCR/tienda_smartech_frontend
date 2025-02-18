import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Carrito } from '../interfaces/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoSubject = new BehaviorSubject<Carrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  agregarCarrito(carrito: Carrito): number {
    const currentValue = this.carritoSubject.value;
    const itemIndex = currentValue.findIndex(x => x.producto.id == carrito.producto.id);

    if (itemIndex == -1) { currentValue.push(carrito); }

    this.carritoSubject.next([...currentValue]);
    localStorage.setItem("carrito", JSON.stringify(currentValue));

    return itemIndex;
  }

  listarCarrito() { return this.carritoSubject.value; }

  cargarItems() {
    const carritosGuardado = localStorage.getItem("carrito");
    if (carritosGuardado) { this.carritoSubject.next([...JSON.parse(carritosGuardado)]); }
  }

  cantidadTotalCarrito(): number {
    return this.carritoSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  precioTotalCarrito(): number {
    return this.carritoSubject.value.reduce(
      (subTotal, item) => subTotal + item.producto.precio * (1 - item.producto.descuento / 100), 0);
  }

  constructor() { }
}
