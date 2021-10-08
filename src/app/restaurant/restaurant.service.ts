import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../login/auth.service';
import { Food, Location, Restaurant } from './restaurant.type';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  observingComponent!: Observer<Restaurant>
  editsMade: boolean = false

  currentRestaurant!: Restaurant

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) { }


  signUp = (): Observable<Restaurant> => {
    return new Observable(
      observer => {
        this.auth.getProfile().then(
          profile => this.http.get<Restaurant>(
            `${environment.apiUrl}/restaurant/manager/${profile.userId}`
          ).subscribe(
            restaurant => {
              this.observingComponent = observer
              this.refreshWithApi(restaurant)
            }
          )
        )
      }
    )
  }


  getRestaurant = (): void => {
    this.http.get<Restaurant>(
      `${environment.apiUrl}/restaurant/${this.currentRestaurant.restaurantId}`
      ).subscribe(
        restaurant => this.refreshWithApi(restaurant)
      )
  }


  updateRestaurant = (): void => {
    this.formatFoods()
    this.http.put<Restaurant>(
      `${environment.apiUrl}/restaurant/${this.currentRestaurant.restaurantId}`,
      this.currentRestaurant
    ).subscribe(
      restaurant => this.refreshWithApi(restaurant)
    )
  }

  formatFoods(): void {
    this.currentRestaurant.foods.map(food => food.restaurantId = this.currentRestaurant.restaurantId)
  }


  refreshWithApi = (restaurant: Restaurant) => {
    this.editsMade = false
    this.currentRestaurant = restaurant
    this.observingComponent.next(restaurant)
  }


  refreshWithEdits = () => {
    this.editsMade = true
    this.observingComponent.next(this.currentRestaurant)
  }


  addFoodItem = (item: Food) => {
    this.currentRestaurant.foods.push(item)
    this.refreshWithEdits()
  }


  getFoodIndex = (item: Food) => {
    return this.currentRestaurant.foods.findIndex(element => element.name === item.name)
  }


  deleteFoodItem = (item: Food) => {
    this.currentRestaurant.foods.splice(this.getFoodIndex(item), 1)
    this.refreshWithEdits()
  }


  editFoodItem = (item: Food) => {
    this.currentRestaurant.foods[this.getFoodIndex(item)] = item
    this.refreshWithEdits()
  }


  editLocation = (location: Location) => {
    this.currentRestaurant.location = location
    this.refreshWithEdits()
  }
}