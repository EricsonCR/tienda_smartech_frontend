import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { Carrito } from '../interfaces/carrito';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  //Variable token
  getToken(): string {
    const token = localStorage.getItem("token");
    if (token != null && token != undefined) { return token; }
    return "";
  }
  setToken(token: string) { localStorage.setItem("token", token); }
  removeToken() { localStorage.removeItem("token"); }

  // Obersvable para el menu de Datos de cuenta
  private menuCuentaBS = new BehaviorSubject<number>(0);
  menuCuenta = this.menuCuentaBS.asObservable();
  updateMenuCuenta(value: number) {
    Promise.resolve().then(() => {
      this.menuCuentaBS.next(value);
    });
  }

  // Observable para Usuario autenticado
  private usuarioBS = new BehaviorSubject<Usuario>(UsuarioDefault);
  usuario = this.usuarioBS.asObservable();
  setUsuario(usuario: Usuario) {
    this.usuarioBS.next(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }
  getUsuario() {
    if (this.usuarioBS.value.nombres != "") { return this.usuarioBS.value; }
    const usuarioJSON = localStorage.getItem("usuario");
    if (usuarioJSON != null && usuarioJSON != undefined) {
      try { return JSON.parse(usuarioJSON) as Usuario; }
      catch (error) { console.log(error); }
    }
    return UsuarioDefault;
  }
  removeUsuario() {
    localStorage.removeItem("usuario");
    this.usuarioBS.next(UsuarioDefault);
  }

  // Observable para Carrito
  private carritoBS = new BehaviorSubject<Carrito>(CarritoDefault);
  carrito = this.carritoBS.asObservable();
  setCarrito(carrito: Carrito) {
    this.carritoBS.next(carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  getCarrito() {
    if (this.carritoBS.value.id != 0) { return this.carritoBS.value; }
    const carritoJSON = localStorage.getItem("carrito");
    if (carritoJSON != null && carritoJSON != undefined) {
      try { return JSON.parse(carritoJSON) as Carrito; }
      catch (error) { console.log(error); }
    }
    return CarritoDefault;
  }
  removeCarrito() {
    localStorage.removeItem("carrito");
    this.carritoBS.next(CarritoDefault);
  }
  agregarItemCarrito(p: Producto, cantidad: number): number {
    const carrito = this.getCarrito();
    const itemIndex = carrito.carritoDetalles.findIndex(x => x.producto.id == p.id);
    if (itemIndex == -1) {
      carrito.carritoDetalles.push({ id: 0, producto: p, cantidad: cantidad })
      this.setCarrito(carrito);
    }
    return itemIndex;
  }
  eliminarItemCarrito(p: Producto) {
    const carrito = this.getCarrito();
    const itemIndex = carrito.carritoDetalles.findIndex(x => x.producto.id == p.id);
    if (itemIndex != -1) {
      carrito.carritoDetalles.splice(itemIndex, 1);
      this.setCarrito(carrito);
    }
  }
  sumarItemCarrito(p: Producto) {
    const carrito = this.getCarrito();
    const itemIndex = carrito.carritoDetalles.findIndex(x => x.producto.id == p.id);
    if (itemIndex != -1) {
      carrito.carritoDetalles[itemIndex].cantidad++;
      this.setCarrito(carrito);
    }
  }
  restarItemCarrito(p: Producto) {
    const carrito = this.getCarrito();
    const itemIndex = carrito.carritoDetalles.findIndex(x => x.producto.id == p.id);
    if (itemIndex != -1) {
      const cantidad = carrito.carritoDetalles[itemIndex].cantidad;
      if (cantidad > 1) { carrito.carritoDetalles[itemIndex].cantidad--; this.setCarrito(carrito); }
    }
  }
}

const UsuarioDefault: Usuario = {
  id: 0,
  rol: "",
  documento: "",
  numero: "",
  nombres: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  email: "",
  nacimiento: ""
};

const CarritoDefault: Carrito = {
  id: 0,
  usuario: UsuarioDefault,
  carritoDetalles: []
};