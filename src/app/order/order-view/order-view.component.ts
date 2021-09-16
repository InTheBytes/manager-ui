import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../order.type';
import { OrderTable } from '../order/order-table';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styles: [
    `.customer, .item-name { padding: 0 10%; }`,
  ]
})
export class OrderViewComponent extends OrderTable {

}
