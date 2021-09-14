import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from '../order.type';

@Component({
  selector: 'app-order-view-concise',
  templateUrl: './order-view-concise.component.html',
  styles: [
    `.mat-column-customer { padding-left: 1%; }`,
    `.mat-column-view { align: left; }`,
    `table {margin: 0 auto; width: 100%}`,
    `.item-name { padding: 0 5%; }`
  ]
})
export class OrderViewConciseComponent {

  @Input("orders") orders!: Order[]
  selectedOrder!: Order

  displayedColumns: string[] = ['view', 'window', 'customer'];

  constructor(
    public dialog: MatDialog
  ) { }

  openDetails(template: TemplateRef<any>, order: Order): void {
    this.selectedOrder = order
    this.dialog.open(template)
  }
}
