import { Producto } from "./producto";

export interface CarritoDetalle {
    id: number,
    producto: Producto,
    cantidad: number
}
