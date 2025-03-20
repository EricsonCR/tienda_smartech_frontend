import { Consignatario } from "./consignatario";
import { Direccion } from "./direccion";
import { PedidoDetalle } from "./pedido-detalle";
import { Usuario } from "./usuario";

export interface Pedido {
    id: number,
    numero: string,
    estado: string,
    usuario: Usuario,
    entrega: string,
    consignatario: Consignatario,
    direccion: Direccion,
    metodo_pago: string,
    precio_envio: number,
    precio_cupon: number,
    total: number,
    igv: number,
    comentarios: string,
    fecha_entrega: string,
    pedidoDetalles: PedidoDetalle[]
}
