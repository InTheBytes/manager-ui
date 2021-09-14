export type Order = {
    id: string,
    status: string,
    destination: Location,
    windowStart: Date
    windowEnd: Date,
    customer: User,
    driver: User,
    restaurant: Restaurant,
    items: OrderItem[]
}

export type User = {
    id: string,
    name: string
}

export type Restaurant = {
    id: string,
    name: string,
    location: Location
}

export type Location = {
    unit: number,
    street: string,
    city: string,
    state: string,
    zipCode: string
}

export type OrderItem = {
    food: string,
    quantity: number,
    name: string,
    price: number
}