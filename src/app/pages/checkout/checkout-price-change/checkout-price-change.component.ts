import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkout-price-change',
  templateUrl: './checkout-price-change.component.html',
  styleUrls: ['./checkout-price-change.component.scss']
})
export class CheckoutPriceChangeComponent implements OnInit {
  @Input() cartPrice: string;
  @Output() closeprice = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.closeprice.emit();
  }
}
