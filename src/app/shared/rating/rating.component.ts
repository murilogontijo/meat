import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RestaurantService } from "app/restaurants/restaurant/restaurant.service";

@Component({
  selector: 'mt-rating',
  templateUrl: './rating.component.html'
})
export class RatingComponent implements OnInit {

  @Output() rated = new EventEmitter<number>()

  rates: number[] = [1,2,3,4,5]

  rate: number = 0

  previousRate: number

  constructor(private retaurantService: RestaurantService) { }

  ngOnInit() {
  }

  setRate(r: number){
    this.rate = r
    this.retaurantService.setRating(r)
    this.previousRate = undefined
    this.rated.emit(this.rate)
  }

  setTemporaryRate(r: number){
    if (this.previousRate === undefined){
      this.previousRate = this.rate
    }
    this.rate = r
  }

  clearTemporaryRate(){
    if (this.previousRate !== undefined){
      this.rate = this.previousRate
      this.previousRate = undefined
    }
  }

}
