import { CarritoDetalle } from "./carrito-detalle";
import { Producto } from "./producto";
import { Usuario } from "./usuario";

export interface Carrito {
    id: number,
    usuario: Usuario,
    carritoDetalles: CarritoDetalle[]

}
