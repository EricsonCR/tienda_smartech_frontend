import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../interfaces/pedido';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {

  opcionPago: number = 1;
  pedido!: Pedido;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.updateMenuCompra(3);
    this.pedido = this.sharedService.getPedido();
  }

  selectPago(index: number) {
    this.opcionPago = index;
  }

  totalPedido(p: Pedido): string {
    if (p.detalles.length > 0) {
      let total: number = 0;
      p.detalles.forEach((item) => {
        total += item.precio * item.cantidad;
      });
      total += p.precio_envio;
      return total.toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "0";
  }

  pagar() {
    console.log(this.pedido);
  }

}
