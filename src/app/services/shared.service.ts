import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { Carrito } from '../interfaces/carrito';
import { Producto } from '../interfaces/producto';
import { Pedido } from '../interfaces/pedido';
import { Direccion } from '../interfaces/direccion';
import { Consignatario } from '../interfaces/consignatario';

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

  private menuCompraBS = new BehaviorSubject<number>(0);
  menuCompra = this.menuCompraBS.asObservable();
  updateMenuCompra(value: number) {
    Promise.resolve().then(() => {
      this.menuCompraBS.next(value);
    });
  }

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
    if (localStorage.getItem("usuario") !== null) {
      return JSON.parse(localStorage.getItem("usuario")!) as Usuario;
    }
    return UsuarioDefault;
  }
  removeUsuario() {
    localStorage.removeItem("usuario");
    this.usuarioBS.next(UsuarioDefault);
  }

  //Observable Pedido
  private pedidoBS = new BehaviorSubject<Pedido>(PedidoDefault);
  pedido = this.pedidoBS.asObservable();
  setPedido(pedido: Pedido) {
    this.pedidoBS.next(pedido);
    localStorage.setItem("pedido", JSON.stringify(pedido));
  }
  getPedido(): Pedido {
    if (this.pedidoBS.value.entrega != "") { return this.pedidoBS.value; }
    if (localStorage.getItem("pedido") !== null) {
      return JSON.parse(localStorage.getItem("pedido")!) as Pedido;
    }
    return PedidoDefault;
  }
  removePedido() {
    localStorage.removeItem("pedido");
    this.pedidoBS.next(PedidoDefault);
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
  nacimiento: "",
  domicilios: [],
  pedidos: []
};

const DireccionDefault: Direccion = {
  id: 0,
  numero: "",
  via: "",
  nombre: "",
  referencia: "",
  distrito: " ",
  provincia: "",
  departamento: "",
  codigo_postal: 0,
};

const CarritoDefault: Carrito = {
  id: 0,
  usuario: UsuarioDefault,
  carritoDetalles: []
};

const ConsignatarioDetault: Consignatario = {
  id: 0,
  documento: "",
  numero: "",
  nombres: "",
  celular: "",
  email: ""
}

const PedidoDefault: Pedido = {
  id: 0,
  numero: "",
  estado: "GENERADO",
  usuario: UsuarioDefault,
  entrega: "DELIVERY",
  consignatario: ConsignatarioDetault,
  direccion: DireccionDefault,
  metodo_pago: "",
  precio_envio: 0,
  precio_cupon: 0,
  total: 0,
  igv: 0,
  comentarios: "",
  fecha_entrega: "00/00/00",
  pedidoDetalles: []
};