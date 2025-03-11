import { Producto } from "./producto";

export interface PedidoDetalle {
    id: number,
    producto: Producto,
    cantidad: number,
    precio: number
}
