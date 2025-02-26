import { CarritoDetalle } from "./carrito-detalle";
import { Usuario } from "./usuario";

export interface Carrito {
    id: number,
    usuario: Usuario,
    carritoDetalles: CarritoDetalle[]

}
