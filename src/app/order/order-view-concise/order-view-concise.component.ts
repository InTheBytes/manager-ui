import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from '../order.type';
import { OrderTable } from '../order/order-table';

@Component({
  selector: 'app-order-view-concise',
  templateUrl: './order-view-concise.component.html',
  styles: [
    `.mat-column-customer { padding-left: 1%; }`,
    `.mat-column-view { align: left; }`,
    `table {margin: 0 auto; width: 100%}`,
    `.item-name { padding: 0 5%; }`,
    `.changeButton { margin: 2% auto 0 auto; }`
  ]
})
export class OrderViewConciseComponent extends OrderTable {

  selectedOrder!: Order

  displayedColumns: string[] = ['view', 'window', 'customer'];

  constructor(
    public dialog: MatDialog
  ) {
    super()
   }

  openDetails(template: TemplateRef<any>, order: Order): void {
    this.selectedOrder = order
    this.dialog.open(template)
  }

  onButtonClick(order: Order) {
    this.dialog.closeAll()
    super.onButtonClick(order)
  }
}
