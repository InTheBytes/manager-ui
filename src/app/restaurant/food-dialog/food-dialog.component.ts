import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Food } from '../restaurant.type';

@Component({
  selector: 'app-food-dialog',
  templateUrl: './food-dialog.component.html',
  styles: ['mat-form-field {width: 100%;}']
})
export class FoodDialogComponent implements OnInit {

  @Input('foodItem') foodItem!: Food
  @Output('cancel') cancel: EventEmitter<any> = new EventEmitter()

  isEditFood: boolean = false

  constructor(
    public service: RestaurantService
  ) { }

  ngOnInit(): void {
    if (this.foodItem === null || typeof this.foodItem === 'undefined') {
      this.foodItem = this.generateEmptyFood()
    } else {
      this.foodItem = Object.assign({}, this.foodItem)
      this.isEditFood = true
    }
  }

  generateEmptyFood(): Food {
    return {
      name: '',
      price: 0,
      description: ''
    }
  }

  verify(): boolean {
    for (const [key, value] of Object.entries(this.generateEmptyFood())) {
      if (Object.assign(this.foodItem)[key] === value) {
        return false
      }
    }
    return true
  }

  onCancel(): void {
    this.cancel.emit()
  }

  onSubmit(): void {
    let funct = this.isEditFood ? this.service.editFoodItem : this.service.addFoodItem
    funct(this.foodItem)
    this.onCancel()
  }

}
