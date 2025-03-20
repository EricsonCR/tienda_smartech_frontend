import { Usuario } from "./usuario";

export interface Direccion {
    id: number;
    via: string;
    nombre: string;
    numero: string;
    referencia: string;
    distrito: string;
    provincia: string;
    departamento: string;
    codigo_postal: number;
}
