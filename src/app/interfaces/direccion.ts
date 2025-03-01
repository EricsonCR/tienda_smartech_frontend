import { Usuario } from "./usuario";

export interface Direccion {
    id: number;
    usuario: Usuario;
    documento: string;
    numero: string;
    nombres: string;
    celular: string;
    via: string;
    direccion: string;
    referencia: string;
    distrito: string;
    provincia: string;
    departamento: string;
    codigo_postal: number;
}
