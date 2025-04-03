import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Direccion } from '../../../interfaces/direccion';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { Pedido } from '../../../interfaces/pedido';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Domicilio } from '../../../interfaces/domicilio';
import { Consignatario } from '../../../interfaces/consignatario';
import { Oficina } from '../../../interfaces/oficina';
import { OficinaService } from '../../../services/oficina.service';

@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent implements OnInit {

  listaDocumentos = [
    { value: "DNI" },
    { value: "CE" },
    { value: "PASAPORTE" }
  ];

  estadoAlert: boolean = false;
  mensajeAlert: string = "Hola Mundo";

  fechas: { fecha: Date, precio: number }[] = [];
  opcionFechaEnvio: number = 0;
  opcionFechaRetiro: number = 0;
  opcionEntrega: number = 0;
  opcionDireccionEnvio: number = 0;
  opcionDireccionRetiro: number = 0;
  comentarios: string = "";
  domicilios: Domicilio[] = [];

  oficinasRetiro: Oficina[] = [];
  oficinasRetiroSelect: Oficina[] = [];
  distritos: string[] = [];
  distritoSelect: string = "";

  pedido: Pedido = PedidoDefault;
  consignatarioForm!: FormGroup;

  constructor(
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private oficinaService: OficinaService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCompra(2);
    this.fechas = this.obtenerFechasDesde(new Date());
    this.getUsuario(this.sharedService.getUsuario());
    this.getDireccionesRetiro();
    this.initConsignatario(ConsignatarioDetault);
  }

  initConsignatario(consignatario: Consignatario) {
    consignatario.documento = this.listaDocumentos[0].value;
    this.consignatarioForm = this.fb.group({
      documento: [consignatario.documento, Validators.required],
      numero: [consignatario.numero, Validators.required],
      celular: [consignatario.celular, Validators.required],
      nombres: [consignatario.nombres, Validators.required]
    });
  }

  getDireccionesRetiro() {
    this.oficinaService.listar().subscribe({
      next: (result) => {
        if (result.status == "OK") {
          this.agregarDistritos(result.data);
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  agregarDistritos(oficinas: Oficina[]) {
    this.oficinasRetiro = oficinas;
    oficinas.forEach((item) => {
      if (!this.distritos.includes(item.direccion.distrito)) {
        this.distritos.push(item.direccion.distrito);
      }
    });
  }

  distritoSeleccionado() {
    const oficinas: Oficina[] = [];
    this.oficinasRetiro.forEach((item) => {
      if (item.direccion.distrito == this.distritoSelect) { oficinas.push(item); }
    });
    this.oficinasRetiroSelect = oficinas;
    this.opcionDireccionRetiro = 0;
    this.pedido.direccion = DireccionDefault;
    this.sharedService.setPedido(this.pedido);
  }

  getPedido(p: Pedido) {
    this.pedido = p;
    if (this.pedido.entrega != "") {
      if (this.pedido.entrega == "DELIVERY") { this.opcionEntrega = 1; }
      else if (this.pedido.entrega == "RETIRO") { this.opcionEntrega = 2; }
      const indexDireccion = this.domicilios.findIndex(x => x.direccion.id == this.pedido.direccion.id);
      if (indexDireccion != -1) { this.opcionDireccionEnvio = indexDireccion + 1; }
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
          this.domicilios = result.data.domicilios as Domicilio[];
          this.getPedido(this.sharedService.getPedido());
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  continuarPedido() {
    this.pedido.comentarios = this.comentarios;
    this.pedido.usuario = this.sharedService.getUsuario();

    if (this.pedido.entrega == "DEFAULT") { this.estadoAlert = true; this.mensajeAlert = "Selecciona Envio o Retiro"; return; }
    if (this.pedido.direccion.id == 0) { this.estadoAlert = true; this.mensajeAlert = "Selecciona Direccion"; return; }

    if (this.pedido.entrega == "DELIVERY") {
      if (this.pedido.precio_envio == 0) { this.estadoAlert = true; this.mensajeAlert = "Precio envio delivery debe ser mayor S/ 0.00"; return; }
    } else if (this.pedido.entrega == "RETIRO") {
      if (this.consignatarioForm.invalid) { this.estadoAlert = true; this.mensajeAlert = "Campos del formulario consgignatario falta completar"; return; }
      if (this.pedido.precio_envio > 0) { this.estadoAlert = true; this.mensajeAlert = "Precio envio delivery deber ser S/ 0.00"; return; }
      this.pedido.consignatario = this.consignatarioForm.value;

    }

    if (this.pedido.consignatario.id == 0) { this.estadoAlert = true; this.mensajeAlert = "Selecciona Consignatario"; return; }
    if (this.pedido.fecha_entrega == "") { this.estadoAlert = true; this.mensajeAlert = "Selecciona feha entrega"; return; }

    this.sharedService.setPedido(this.pedido);
    this.router.navigate(["compra/pago"]);
  }

  selectEntrega(index: number) {
    this.opcionEntrega = index;
    this.opcionDireccionEnvio = 0;
    this.opcionDireccionRetiro = 0;
    this.opcionFechaEnvio = 0;
    this.opcionFechaRetiro = 0;
    this.pedido.fecha_entrega = "";
    this.pedido.precio_envio = 0;
    this.pedido.consignatario = ConsignatarioDetault;
    this.pedido.direccion = DireccionDefault;
    if (this.opcionEntrega == 1) {
      this.pedido.entrega = "DELIVERY";
    }
    else if (this.opcionEntrega == 2) {
      this.pedido.entrega = "RETIRO";
    }
    this.sharedService.setPedido(this.pedido);
  }
  selectDireccionEnvio(index: number) {
    this.opcionDireccionEnvio = index;
    this.pedido.consignatario = this.domicilios[index - 1].consignatario;
    this.pedido.direccion = this.domicilios[index - 1].direccion;
    this.sharedService.setPedido(this.pedido);
  }

  selectDireccionRetiro(index: number) {
    this.opcionDireccionRetiro = index;
    this.pedido.direccion = this.oficinasRetiroSelect[index - 1].direccion;
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

  cerrarAlert() {
    this.estadoAlert = false;
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
  pedidos: [],
  favoritos: []
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
  entrega: "DEFAULT",
  consignatario: ConsignatarioDetault,
  direccion: DireccionDefault,
  metodo_pago: "",
  precio_envio: 0,
  precio_cupon: 0,
  total: 0,
  igv: 0,
  comentarios: "",
  fecha_entrega: "",
  pedidoDetalles: []
};

const OficinaDefault: Oficina = {
  id: 0,
  nombre: "",
  celular: "",
  hora_inicio: "",
  hora_fin: "",
  usuario: UsuarioDefault,
  direccion: DireccionDefault
}