import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Direccion } from '../../interfaces/direccion';
import { DireccionService } from '../../services/direccion.service';

@Component({
  selector: 'app-crear-direccion-cuenta',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './crear-direccion-cuenta.component.html',
  styleUrl: './crear-direccion-cuenta.component.css'
})
export class CrearDireccionCuentaComponent implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    this.initFormGroup(direccionDefault);
    const id = this.route.snapshot.paramMap.get("usuario");
    if (id != null && id != undefined) {
      this.direccionService.buscarPorId(id as unknown as number).subscribe({
        next: (result) => {
          if (result.status == "OK") { this.initFormGroup(result.data); }
        },
        error: (error) => { console.log(error); }
      });
    }
    this.sharedService.updateMenuCuenta(3);
  }

  initFormGroup(direccion: Direccion) {
    this.direccionForm = this.fb.group({
      documento: [this.listaDocumentos[0].value, [Validators.required]],
      numero: [direccion.numero, [Validators.required]],
      nombres: [direccion.nombres, [Validators.required]],
      celular: [direccion.celular, [Validators.required]],
      via: [this.listaVias[0].value, [Validators.required]],
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
    this.direccionService.registrar(direccion).subscribe({
      next: (result) => { console.log(result); },
      error: (error) => { console.log(error); }
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