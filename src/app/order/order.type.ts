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

type User = {
    id: string,
    name: string
}

type Restaurant = {
    id: string,
    name: string,
    location: Location
}

type Location = {
    unit: number,
    street: string,
    city: string,
    state: string,
    zipCode: string
}

type OrderItem = {
    food: string,
    quantity: number,
    name: string,
    price: number
}