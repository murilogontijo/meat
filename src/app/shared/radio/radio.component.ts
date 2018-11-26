import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'

import { RadioOption } from './radio-option.model'

@Component({
  selector: 'mt-radio',
  templateUrl: './radio.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements OnInit, ControlValueAccessor {

  @Input() options: RadioOption[]

  value: any

  onChange: any

  constructor() { }

  ngOnInit() {
  }

  setValue(value: any) {
    this.value = value
    this.setSelectPagamento(value)
    this.onChange(this.value)
  }

  setSelectPagamento(tipoPagamento: string) {
    this.options.forEach(o => {
      if (this.eCartao(tipoPagamento)) {
        if (tipoPagamento.includes(o.value) && !o.selected) {
          this.clearSelectCartoes()
          o.selected = true
        } else if (tipoPagamento.includes(o.value) && o.selected) {
          o.selected = false
        }
      } else {
        if (tipoPagamento.includes(o.value) && !o.selected) {
          o.selected = true
        } else if (tipoPagamento.includes(o.value) && o.selected) {
          o.selected = false
        }
      }
    })
  }

  clearSelectCartoes() {
    this.options.forEach(o => {
      if (this.eCartao(o.value)) {
        o.selected = false
      }
    })
  }

  eCartao(tipoPagamento: string) {
    return !tipoPagamento.includes('MON')
  }

  /**
   * Write a new value to the element.
   */
  writeValue(obj: any): void {
    this.value = obj
  }
  /**
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  /**
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any): void { }
  /**
   * This function is called when the control status changes to or from "DISABLED".
   * Depending on the value, it will enable or disable the appropriate DOM element.
   *
   * @param isDisabled
   */
  setDisabledState?(isDisabled: boolean): void { }

}
