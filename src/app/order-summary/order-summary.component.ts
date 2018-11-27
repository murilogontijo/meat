import { Component, OnInit } from '@angular/core';
import { OrderService } from "app/order/order.service";
import { RestaurantService } from "app/restaurants/restaurant/restaurant.service";

@Component({
  selector: 'mt-order-summary',
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent implements OnInit {

  rated: boolean = false
  nome: string
  comentario: string

  constructor(private orderService: OrderService, private restaurantService: RestaurantService) { }

  ngOnInit() {
  }

  rate() {
    this.orderService.addReview(this.getReview())
      .subscribe((restaurantId: string) => {
        this.rated = true
      })
  }

  getReview(): any {
    let review: any = {}
    review.name = this.nome
    review.comments = this.comentario
    review.date = new Date()
    review.rating = this.restaurantService.getRating()
    review.restaurantId = this.restaurantService.getRestauranteSelecionado().id
    return review
  }

}
