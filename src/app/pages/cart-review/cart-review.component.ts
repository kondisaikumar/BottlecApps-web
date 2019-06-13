import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-review',
  templateUrl: './cart-review.component.html',
  styleUrls: ['./cart-review.component.scss']
})
export class CartReviewComponent implements OnInit {
  @Input() cartItems: any;
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }
}
