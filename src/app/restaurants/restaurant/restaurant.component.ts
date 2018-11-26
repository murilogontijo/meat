import { Component, OnInit, Input } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations'

import {Restaurant} from './restaurant.model'

@Component({
  selector: 'mt-restaurant',
  templateUrl: './restaurant.component.html',
  animations: [
    trigger('restaurantAppeared', [
      state('ready', style({opacity: 1})),
      transition('void => ready', [
        style({opacity: 0, transform: 'translate(-30px, -10px)'}),
        animate('300ms 0s ease-in-out')
      ])
    ])
  ]
})
export class RestaurantComponent implements OnInit {

  restaurantState = 'ready'
  fechado: boolean = false
  urlRestaurant: string = ''

  @Input() restaurant: Restaurant

  constructor() { }

  ngOnInit() {
    this.estaFechado()
  }

  estaFechado() {
    let startingTime: number = this.restaurant.startingTime
    let finalTime: number = this.restaurant.finalTime
    let currentTime: number = new Date().getHours()
    this.fechado = !((currentTime >= startingTime) && (currentTime <= finalTime))
    if(!this.fechado) {
      this.urlRestaurant = '/restaurants'
    }
  }

  getRouterLinkRestaurant() {
    if(!this.fechado) {
      return ['/restaurants', this.restaurant.id]
    } else {
      return null
    }
  }
  
  getClass() {
    if(!this.fechado) {
      return 'place-info-box'
    } else {
      return 'place-info-box-disabled'
    }
  }


}
