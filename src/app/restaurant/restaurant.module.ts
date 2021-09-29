import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FoodDialogComponent } from './food-dialog/food-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    RestaurantDetailsComponent,
    FoodDialogComponent,
    LocationDialogComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TextFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class RestaurantModule { }
