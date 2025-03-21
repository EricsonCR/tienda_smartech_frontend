import { Direccion } from "./direccion";
import { Usuario } from "./usuario";

export interface Oficina {
    id: number,
    nombre: string,
    celular: string,
    hora_inicio: string,
    hora_fin: string,
    usuario: Usuario,
    direccion: Direccion
}
