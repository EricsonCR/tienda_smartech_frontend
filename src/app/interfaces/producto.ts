import { Categoria } from "./categoria";
import { Especificacion } from "./especificacion";
import { Foto } from "./foto";
import { Marca } from "./marca";

export interface Producto {
    id: number,
    sku: string;
    nombre: string;
    descripcion: string;
    slogan: string;
    marca: Marca;
    categoria: Categoria;
    precio: number;
    descuento: number;
    stock: number;
    fotos: Foto[];
    especificaciones: Especificacion[];
}