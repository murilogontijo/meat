import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'

import { Router } from '@angular/router'

import { RadioOption } from '../shared/radio/radio-option.model'
import { OrderService } from './order.service'
import { CartItem } from '../restaurant-detail/shopping-cart/cart-item.model'
import { Order, OrderItem } from "./order.model"

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  numberPattern = /^[0-9]*$/

  orderForm: FormGroup

  delivery: number = 8

  eCartao: boolean = false
  eDinheiro: boolean = false

  paymentOption: any[] = []

  paymentOptions: RadioOption[] = [
    { label: 'Dinheiro', value: 'MON', selected: false },
    { label: 'Cartão de Débito', value: 'DEB', selected: false },
    { label: 'Cartão de Crédito', value: 'CRED', selected: false },
    { label: 'Cartão Refeição', value: 'REF', selected: false }
  ]

  constructor(private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      emailConfirmation: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      number: this.formBuilder.control('', [Validators.pattern(this.numberPattern)]),
      optionalAddress: this.formBuilder.control(''),
      paymentOption: this.formBuilder.control('', [Validators.required])
    }, { validator: OrderComponent.equalsTo })
  }

  static equalsTo(group: AbstractControl): { [key: string]: boolean } {
    const email = group.get('email')
    const emailConfirmation = group.get('emailConfirmation')
    if (!email || !emailConfirmation) {
      return undefined
    }
    if (email.value !== emailConfirmation.value) {
      return { emailsNotMatch: true }
    }
    return undefined
  }

  itemsValue(): number {
    return this.orderService.itemsValue()
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems()
  }

  increaseQty(item: CartItem) {
    this.orderService.increaseQty(item)
  }

  decreaseQty(item: CartItem) {
    this.orderService.decreaseQty(item)
  }

  remove(item: CartItem) {
    this.orderService.remove(item)
  }

  checkOrder(order: Order) {
    this.setPagamento(order)
    this.removeControlsPagamento(order)
    order.orderItems = this.cartItems()
      .map((item: CartItem) => new OrderItem(item.quantity, item.menuItem.id))
    this.orderService.checkOrder(order)
      .subscribe((orderId: string) => {
        this.router.navigate(['/order-summary'])
        this.orderService.clear()
      })
  }

  setPagamento(order: Order) {
    let payments: any[] = []
    let obj: any = {}
    this.paymentOption.forEach(p => {
      obj.payment = p
      if (p.includes('MON')) {
        obj.valor = order.dinheiro
      } else {
        let valorEmDinheiro: number = order.dinheiro
        if (valorEmDinheiro !== null) {
          obj.valor = this.orderService.getTotalVenda() + 8 - valorEmDinheiro
        } else {
          obj.valor = this.orderService.getTotalVenda() + 8
        }
        obj.numero = order.numeroCartao
        obj.codigo = order.codigoCartao
        obj.vencimento = order.vencimentoCartao
      }
      payments.push(obj)
      obj = {}
    })
    order.paymentOption = payments
  }

  removeControlsPagamento(order: Order) {
    delete order.dinheiro
    delete order.numeroCartao
    delete order.vencimentoCartao
    delete order.codigoCartao
  }

  verificarTipoPagamento() {
    let pagamento: string = this.orderForm.get('paymentOption').value
    this.eCartao = this.temCartaoSelecionado()
    this.eDinheiro = this.temDinheiroSelecionado()

    let money: boolean = pagamento.includes('MON')

    if (money && this.eDinheiro) {
      this.addFormValidatorDinheiro()
      this.paymentOption.push(pagamento)
    } else if (money && !this.eDinheiro) {
      this.removeFormValidatorDinheiro()
      this.paymentOption.splice(this.paymentOption.indexOf(pagamento), 1)
    } else if (!money && this.eCartao) {
      this.addFormDadosPagamento()
      this.paymentOption.push(pagamento)
    } else if (!money && !this.eCartao) {
      this.removeFormDadosPagamento()
      this.paymentOption.splice(this.paymentOption.indexOf(pagamento), 1)
    }

    this.formBuilder.control('paymentOption').setValue(this.paymentOption)
    console.log(this.paymentOption)
    console.log(this.formBuilder.control('paymentOption').value)
  }

  temDinheiroSelecionado(): boolean {
    return this.paymentOptions.filter(payment => {
      return payment.value.includes('MON') && payment.selected
    }).length > 0
  }

  temCartaoSelecionado(): boolean {
    return this.paymentOptions.filter(payment => {
      return !payment.value.includes('MON') && payment.selected
    }).length > 0
  }

  addFormValidatorDinheiro() {
    this.orderForm.setControl('dinheiro', this.formBuilder.control('', [Validators.required]))
  }

  removeFormValidatorDinheiro() {
    this.orderForm.removeControl('dinheiro')
  }

  addFormDadosPagamento() {
    this.orderForm.setControl('numeroCartao', this.formBuilder.control('', [Validators.required]))
    this.orderForm.setControl('codigoCartao', this.formBuilder.control('', [Validators.required]))
    this.orderForm.setControl('vencimentoCartao', this.formBuilder.control('', [Validators.required]))
  }

  removeFormDadosPagamento() {
    this.orderForm.removeControl('numeroCartao')
    this.orderForm.removeControl('codigoCartao')
    this.orderForm.removeControl('vencimentoCartao')
  }

}
