import { Domicilio } from "./domicilio";
import { Favorito } from "./favorito";
import { Pedido } from "./pedido";

export interface Usuario {
    id: number,
    rol: string,
    documento: string,
    numero: string,
    nombres: string,
    apellidos: string,
    telefono: string,
    direccion: string,
    email: string,
    nacimiento: string,
    domicilios: Domicilio[],
    pedidos: Pedido[],
    favoritos: Favorito[]
}
