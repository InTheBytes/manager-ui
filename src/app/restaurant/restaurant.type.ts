import { User } from "../login/auth.service"

export type Restaurant = {
    restaurantId: string
    name: string
    cuisine: string
    location: Location
    foods: Food[]
    managers: User[]
}

export type Location = {
    unit: number,
    street: string,
    city: string,
    state: string,
    zipCode: string
}

export type Food = {
    restaurantId?: string
    name: string
    price: number
    description: string
}