import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'mt-status-delivery',
  templateUrl: './status-delivery.component.html',
  styleUrls: ['./status-delivery.component.css']
})
export class StatusDeliveryComponent implements OnInit {

  pronto: boolean
  aguardando: boolean

  constructor(private router: Router) { }

  ngOnInit() {
    this.pronto = false

    setInterval(() => this.aguardando = true, 5000)
    setInterval(() => this.pronto = true, 10000)
    setInterval(() =>  this.router.navigate(['/order-summary']), 15000)
  }

}
