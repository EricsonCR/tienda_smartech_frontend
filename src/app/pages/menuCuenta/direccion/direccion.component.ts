import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { DireccionService } from '../../../services/direccion.service';
import { Direccion } from '../../../interfaces/direccion';
import Swal from 'sweetalert2';

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

  direccionForm!: FormGroup;
  valueButton: string = "";
  actionSubmit: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    this.initFormGroup(direccionDefault);
    const id = this.route.snapshot.paramMap.get("id");
    if (id != null && id != undefined) {
      this.valueButton = "Editar direccion";
      this.actionSubmit = "editar";
      this.direccionService.buscarPorId(id as unknown as number).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.initFormGroup(result.data); }
        },
        error: (error) => { console.log(error); }
      });
    } else {
      this.valueButton = "Registrar direccion";
      this.actionSubmit = "registrar";
    }
    this.sharedService.updateMenuCuenta(3);
  }

  initFormGroup(direccion: Direccion) {
    if (direccion.documento == "") { direccion.documento = this.listaDocumentos[0].value }
    if (direccion.via == "") { direccion.via = this.listaVias[0].value }
    this.direccionForm = this.fb.group({
      id: [direccion.id],
      documento: [direccion.documento, [Validators.required]],
      numero: [direccion.numero, [Validators.required]],
      nombres: [direccion.nombres, [Validators.required]],
      celular: [direccion.celular, [Validators.required]],
      via: [direccion.via, [Validators.required]],
      direccion: [direccion.direccion, [Validators.required]],
      referencia: [direccion.referencia, [Validators.required]],
      distrito: [direccion.distrito, [Validators.required]],
      provincia: [direccion.provincia, [Validators.required]],
      departamento: [direccion.departamento, [Validators.required]],
      codigo_postal: [direccion.codigo_postal, [Validators.required]]
    });
  }

  registrarDireccion() {
    let direccion: Direccion = this.direccionForm.value;
    direccion.usuario = this.sharedService.getUsuario();
    if (this.actionSubmit == "editar") {
      this.direccionService.actualizar(direccion).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.alertOK(result.message); }
          else { this.alertError(result.message); }
        },
        error: (error) => { console.log(error); }
      });
    } else if (this.actionSubmit == "registrar") {
      this.direccionService.registrar(direccion).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.alertOK(result.message); this.router.navigate(["/cuenta/direccion"]); }
          else { this.alertError(result.message); }
        },
        error: (error) => { console.log(error); }
      });
      console.log("registrar");
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

const direccionDefault: Direccion = {
  id: 0,
  usuario: undefined!,
  documento: "",
  numero: "",
  nombres: "",
  celular: "",
  via: "",
  direccion: "",
  referencia: "",
  distrito: "",
  provincia: "",
  departamento: "",
  codigo_postal: 0
};