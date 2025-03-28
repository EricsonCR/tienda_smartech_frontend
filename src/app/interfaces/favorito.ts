import { Producto } from "./producto";
import { Usuario } from "./usuario";

export interface Favorito {
    id:number,
    usuario:Usuario,
    producto:Producto
}
