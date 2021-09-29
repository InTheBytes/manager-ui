import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';
import { Location } from '../restaurant.type';

type state = {
  abv: string
}

const stateAbbreviations: string[] = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
  'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
  'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP',
  'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY',
]

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styles: [
    `.unit-field {width: 20%; padding-right: 5%; padding-left: 10%}`,
    `.street-field {width: 55%; padding-right: 10%}`,
    `.city-field {width: 80%; padding-right: 10%; padding-left: 10%}`,
    `.zip-field {width: 20%; padding-left: 10%; padding-right: 15%}`,
    `.state-field {width: 30%; padding-right: 10%; padding-left: %5 }`,
    `mat-dialog-actions {display: flex; justify-content: center}`
  ]
})
export class LocationDialogComponent implements OnInit {

  @Input('location') location!: Location
  @Input('name') restaurantName!: string
  @Output('cancel') cancel: EventEmitter<any> = new EventEmitter();

  states: state[] = stateAbbreviations.map(abbreviation => {return {abv: abbreviation}})
  locationState!: state

  constructor(
    public service: RestaurantService
  ) { }

  ngOnInit() {
    this.location = Object.assign({}, this.location)
  }

  onSubmit(): void {
    // this.location.state = this.locationState.abv
    this.service.editLocation(this.location)
    this.onCancel()
  }

  onCancel(): void {
    this.cancel.emit()
  }

}
