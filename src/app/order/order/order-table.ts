import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Order } from "../order.type";

@Directive()
export abstract class OrderTable implements OnInit {

    @Input('showDate') showDate!: boolean
    @Input("orders") orders!: Order[]
    @Input("buttonText") buttonText!: string
    @Output("buttonClick") buttonClick = new EventEmitter<Order>()

    hasButton!: boolean

    constructor() {}
    
    ngOnInit(): void {
        this.hasButton = this.buttonText !== null && 
            typeof this.buttonText !== 'undefined' && 
            this.buttonText.length > 0
    }

    onButtonClick(order: Order) {
        this.buttonClick.emit(order)
        let index = this.orders.indexOf(order)
        this.orders.splice(index, 1)
    }
}