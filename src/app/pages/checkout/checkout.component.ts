import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails: any;
  orderNumber: string;
  isOrderPlaced = false;
  orderInProgress = false;
  constructor(private cartService: CartService, private commonService: CommonService) {
    this.commonService.orderPlaced.subscribe(data => {
      this.orderInProgress = data;
    });
   }

  ngOnInit() {
    this.isOrderPlaced = false;
    this.cartDetails = this.cartService.cartdetails;
  }

  onOrderPlace(cartDetails) {
    this.orderNumber = '';
    this.isOrderPlaced = true;
    if (cartDetails && cartDetails.OrderNo) {
      this.orderNumber = cartDetails.OrderNo;
    }
  }
}
