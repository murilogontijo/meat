
import { Injectable } from '@angular/core'
import { Restaurant } from "app/restaurants/restaurant/restaurant.model";

@Injectable()
export class RestaurantService {

    restauranteSelecionado: Restaurant
    rating: number

    constructor() { }

    setRestaurante(restaurante: Restaurant) {
        this.restauranteSelecionado = restaurante
    }

    getRestauranteSelecionado(): Restaurant {
        return this.restauranteSelecionado
    }

    setRating(rating: number) {
        this.rating = rating
    }

    getRating(): number {
        return this.rating
    }

}