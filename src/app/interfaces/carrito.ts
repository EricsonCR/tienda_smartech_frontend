import { Producto } from "./producto";

export interface Carrito {
    producto: Producto;
    cantidad: number;
}
