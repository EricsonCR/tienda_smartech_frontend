import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Direccion } from '../../../interfaces/direccion';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { Router, RouterLink } from '@angular/router';
import { Pedido } from '../../../interfaces/pedido';
import { FormsModule } from '@angular/forms';
import { PedidoDetalle } from '../../../interfaces/pedido-detalle';

@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent implements OnInit {

  fechas: { fecha: Date, precio: number }[] = [];
  opcionFechaEnvio: number = 0;
  opcionFechaRetiro: number = 0;
  opcionEntrega: number = 0;
  opcionDireccion: number = 0;
  instrucciones: string = "";
  direcciones: Direccion[] = [];
  pedido: Pedido = PedidoDefault;

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCompra(2);
    this.fechas = this.obtenerFechasDesde(new Date());
    this.getUsuario(this.sharedService.getUsuario());
  }

  getPedido(p: Pedido) {

    if (p.entrega != "") {
      this.pedido = p;
      if (this.sharedService.getCarrito().carritoDetalles.length > 0) {
        this.pedido.detalles = [];
        this.sharedService.getCarrito().carritoDetalles.forEach((item) => {
          this.pedido.detalles.push({ id: 0, producto: item.producto, cantidad: item.cantidad, precio: item.producto.precio * (1 - item.producto.descuento / 100) });
        });
      }
      if (this.pedido.entrega == "DELIVERY") { this.opcionEntrega = 1; }
      else if (this.pedido.entrega == "RETIRO") { this.opcionEntrega = 2; }
      const indexDireccion = this.direcciones.findIndex(x => x.id == this.pedido.direccion.id);
      if (indexDireccion != -1) { this.opcionDireccion = indexDireccion + 1; }
      const indexFechaEnvio = this.fechas.findIndex(x => x.fecha.getDate().toString() == this.pedido.fecha_entrega.split("/")[0]);
      if (indexFechaEnvio != -1) { this.opcionFechaEnvio = indexFechaEnvio + 1; }
      const indexFechaRetiro = this.fechas.findIndex(x => x.fecha.getDate().toString() == this.pedido.fecha_entrega.split("/")[0]);
      if (indexFechaRetiro != -1) { this.opcionFechaRetiro = indexFechaRetiro - 3; }
      this.sharedService.setPedido(this.pedido);
    }
  }

  getUsuario(usuario: Usuario) {
    this.usuarioService.buscarPorEmail(usuario.email).subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.direcciones = result.data.direcciones;
          this.getPedido(this.sharedService.getPedido());
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  continuarPedido() {
    this.pedido.comentarios = this.instrucciones;
    this.pedido.usuario = this.sharedService.getUsuario();
    this.sharedService.setPedido(this.pedido);
    if (this.pedido.direccion.id != 0 && this.instrucciones != "" && this.pedido.usuario.id != 0) {
      if (this.pedido.entrega == "DELIVERY" && this.pedido.precio_envio >= 40) {
        const total = this.calcularTotal(this.pedido);
        this.pedido.total = parseFloat(total.toFixed(2));
        this.sharedService.setPedido(this.pedido);
        this.router.navigate(["compra/pago"]);
      } else if (this.pedido.entrega == "RERTIRO" && this.pedido.fecha_entrega != "") {
        this.router.navigate(["compra/pago"]);
      }
    }
  }

  calcularTotal(p: Pedido): number {
    if (p.detalles.length > 0) {
      let total: number = 0;
      p.detalles.forEach((item) => {
        total += item.precio * item.cantidad;
      });
      total += p.precio_envio;
      return total;
    }
    return 0;
  }

  selectEntrega(index: number) {
    this.opcionEntrega = index;
    if (this.opcionEntrega == 1) {
      this.pedido.entrega = "DELIVERY";
      this.opcionFechaEnvio = 0;
      this.pedido.fecha_entrega = "";
      this.pedido.precio_envio = 0;
    }
    else if (this.opcionEntrega == 2) {
      this.pedido.entrega = "RETIRO";
      this.opcionFechaRetiro = 0;
      this.pedido.fecha_entrega = "";
      this.pedido.precio_envio = 0;
    }
    this.sharedService.setPedido(this.pedido);
  }
  selectDireccion(index: number) {
    this.opcionDireccion = index;
    this.pedido.direccion = this.direcciones[index - 1];
    this.sharedService.setPedido(this.pedido);
  }
  selectFechaEnvio(index: number) {
    this.opcionFechaEnvio = index;
    this.pedido.fecha_entrega = this.fechas[this.opcionFechaEnvio - 1].fecha.toLocaleDateString();
    this.pedido.precio_envio = this.fechas[this.opcionFechaEnvio - 1].precio;
    this.sharedService.setPedido(this.pedido);
  }
  selectFechaRetiro(index: number) {
    this.opcionFechaRetiro = index;
    this.pedido.fecha_entrega = this.fechas[this.opcionFechaRetiro + 3].fecha.toLocaleDateString();
    this.pedido.precio_envio = 0;
    this.sharedService.setPedido(this.pedido);
  }


  obtenerDiaSemana(fecha: Date): string {
    const diaSemanas: string[] = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return diaSemanas[fecha.getDay()];
  }
  obtenerMes(fecha: Date): string {
    const meses: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return meses[fecha.getMonth()];
  }

  obtenerFechasDesde(date: Date): { fecha: Date, precio: number }[] {
    const fechas: { fecha: Date, precio: number }[] = [];
    const cantidadFechas: number = 12;  // Cantidad de fechas que se van a generar
    const precio12H: number = 150;  // Precio para el primer rango de fechas
    const precio24H: number = 80;  // Precio para el segundo rango de fechas
    const precioMin: number = 40;  // Precio para el tercer rango de fechas
    let contador = 0; // Para asegurarnos de agregar solo la cantidad de items especificada
    let fechaFutura: Date = new Date(date); // Copiar la fecha recibida

    while (contador < cantidadFechas) {
      if (fechaFutura.getDay() === 0) { fechaFutura.setDate(fechaFutura.getDate() + 1); continue; }
      let precio = precioMin;
      if (contador === 0) { precio = precio12H; }
      else if (contador < 2) { precio = precio24H; }
      fechas.push({ fecha: new Date(fechaFutura), precio: precio });
      fechaFutura.setDate(fechaFutura.getDate() + 1);
      contador++;
    }
    return fechas;
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
  direcciones: []
};

const DireccionDefault: Direccion = {
  id: 0,
  usuario: UsuarioDefault,
  documento: "",
  numero: "",
  nombres: "",
  celular: "",
  via: "",
  direccion: "",
  referencia: "",
  distrito: " ",
  provincia: "",
  departamento: "",
  codigo_postal: 0,
};

const PedidoDefault: Pedido = {
  id: 0,
  numero: "",
  estado: "",
  usuario: UsuarioDefault,
  entrega: "",
  direccion: DireccionDefault!,
  precio_envio: 0,
  precio_cupon: 0,
  total: 0,
  igv: 0,
  comentarios: "",
  fecha_entrega: "",
  detalles: []
};