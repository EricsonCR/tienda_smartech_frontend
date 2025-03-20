import { Consignatario } from "./consignatario";
import { Direccion } from "./direccion";
import { Usuario } from "./usuario";

export interface Domicilio {
    id: number;
    direccion: Direccion,
    consignatario: Consignatario,
    usuario: Usuario
}
