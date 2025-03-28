import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { Direccion } from '../../../interfaces/direccion';
import Swal from 'sweetalert2';
import { Consignatario } from '../../../interfaces/consignatario';
import { Domicilio } from '../../../interfaces/domicilio';
import { Usuario } from '../../../interfaces/usuario';
import { DomicilioService } from '../../../services/domicilio.service';

@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './direccion.component.html',
  styleUrl: './direccion.component.css'
})
export class DireccionComponent {

  listaDocumentos = [
    { value: "DNI" },
    { value: "CE" },
    { value: "PASAPORTE" }
  ];

  listaVias = [
    { value: "AVENIDA" },
    { value: "CALLE" },
    { value: "JIRON" },
    { value: "URB" }
  ];

  domicilioForm!: FormGroup;
  valueButton: string = "";
  actionSubmit: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private domicilioService: DomicilioService
  ) { }

  ngOnInit(): void {
    this.initFormGroup(DomicilioDefault);
    const id = this.route.snapshot.paramMap.get("id");
    if (id != null && id != undefined) {
      this.valueButton = "Editar direccion";
      this.actionSubmit = "Editar";
      this.domicilioService.buscarPorId(id as unknown as number).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.initFormGroup(result.data as Domicilio); }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.valueButton = "Registrar direccion";
      this.actionSubmit = "Crear";
    }
    this.sharedService.updateMenuCuenta(3);
  }

  initFormGroup(domicilio: Domicilio) {
    if (domicilio.consignatario.documento == "") { domicilio.consignatario.documento = this.listaDocumentos[0].value }
    if (domicilio.direccion.via == "") { domicilio.direccion.via = this.listaVias[0].value }
    this.domicilioForm = this.fb.group({
      id: [domicilio.direccion.id],
      consignatario: this.fb.group({
        id: [domicilio.consignatario.id, [Validators.required]],
        documento: [domicilio.consignatario.documento, [Validators.required]],
        numero: [domicilio.consignatario.numero, [Validators.required]],
        nombres: [domicilio.consignatario.nombres, [Validators.required]],
        celular: [domicilio.consignatario.celular, [Validators.required]],
      }),
      direccion: this.fb.group({
        id: [domicilio.consignatario.id, [Validators.required]],
        via: [domicilio.direccion.via, [Validators.required]],
        nombre: [domicilio.direccion.nombre, [Validators.required]],
        numero: [domicilio.direccion.numero, [Validators.required]],
        referencia: [domicilio.direccion.referencia, [Validators.required]],
        distrito: [domicilio.direccion.distrito, [Validators.required]],
        provincia: [domicilio.direccion.provincia, [Validators.required]],
        departamento: [domicilio.direccion.departamento, [Validators.required]],
        codigo_postal: [domicilio.direccion.codigo_postal, [Validators.required]]
      })
    });
  }

  registrarDireccion() {
    let domicilio: Domicilio = this.domicilioForm.value;
    domicilio.usuario = this.sharedService.getUsuario();
    if (this.actionSubmit == "Editar") {
      this.domicilioService.actualizar(domicilio).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.alertOK(result.message); }
          else { this.alertError(result.message); }
        },
        error: (error) => { console.log(error); }
      });
    } else if (this.actionSubmit == "Crear") {
      this.domicilioService.registrar(domicilio).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.alertOK(result.message); this.router.navigate(["/cuenta/direccion"]); }
          else { this.alertError(result.message); }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2500
    });
  }

  alertError(message: string) {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error"
    });
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
  distrito: "",
  provincia: "",
  departamento: "",
  codigo_postal: 0
};

const ConsignatarioDetault: Consignatario = {
  id: 0,
  documento: "",
  numero: "",
  nombres: "",
  celular: "",
  email: ""
}

const DomicilioDefault: Domicilio = {
  id: 0,
  consignatario: ConsignatarioDetault,
  direccion: DireccionDefault,
  usuario: UsuarioDefault
}