import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductStoreService } from '../../services/product-store.service';
import { Store } from '@ngrx/store';
import { ProductStoreSelectors } from '../../state/product-store/product-store.selector';
import { CustomerLoginSession } from '../../models/customer-login-session';
import { ProgressBarService } from '../../shared/services/progress-bar.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @ViewChild('openCartReviewModal') openModal: ElementRef;
  cartDetails: any;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  reviewItems: any;
  storeGetHomeData: any;
  type: string;
  delcheckout = 'n';

  constructor(private store: Store<CustomerLoginSession>,
    private cartService: CartService,
    private customerService: CustomerService,
    private router: Router,
    private decimalPipe: DecimalPipe,
    // private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private storeService: ProductStoreService,
    private progressBarService: ProgressBarService) {
      this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
        }
      });
    }

  ngOnInit() {
    // this.spinnerService.show();
    this.getCartDetails();
  }

  getCartDetails() {
    this.progressBarService.show();
    let cartbody: any;
    cartbody = {
      IsFromCheckOut: false,
      IsToCallDSP: false
    };
    this.cartService.getCartDetails(cartbody).subscribe(
      (data: any) => {
        this.cartDetails = data;
        console.log(this.cartDetails);
        if (this.cartDetails && this.cartDetails.ListCartItem) {
          this.cartService.cartItemCount.next(this.cartDetails.ListCartItem.length);
        }

        this.doStockAvailabilityCheck();
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
  }

  doStockAvailabilityCheck() {
    if (!(this.cartDetails && this.cartDetails.ListCartItem)) {
      return;
    }
    this.reviewItems = this.cartDetails.ListCartItem.filter(item => item.Quantity !== item.QuantityOrdered);

    if (this.reviewItems && this.reviewItems.length > 0) {
      this.delcheckout = 'n';
      this.openModal.nativeElement.click();
    } else if (this.reviewItems.length === 0) {
      this.delcheckout = 'y';
    }

  }

  onPopupClose() {

    this.cartDetails.ListCartItem = this.cartDetails.ListCartItem.filter(item => item.Quantity !== 0);
    this.cartDetails.ListCartItem.map(item => item.QuantityOrdered = item.Quantity);
    this.updateCart();
  }

  onQtyChange(item: any) {
    item.QuantityOrdered = +item.QuantityOrdered;
    item.FinalItemTotal = this.decimalPipe.transform(item.FinalPrice * item.QuantityOrdered, '1.2-2');
    item.FinalItemTotalDisplay = '$' + item.FinalItemTotal;
    this.updateCart();
  }

  removeFromCart(item: any) {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.cartService.removeFromCart(item).subscribe(
      (data: any) => {
        item.InCart = 0;
        if (this.cartDetails && this.cartDetails.ListCartItem) {
          const index = this.cartDetails.ListCartItem.indexOf(item);
          this.cartDetails.ListCartItem.splice(index, 1);
        }
        // this.spinnerService.hide();
        this.progressBarService.hide();
        this.toastr.success(data.SuccessMessage);
        this.getCartDetails();
      });
  }

  updateCart() {
    this.progressBarService.show();
    this.cartService.updateCart(this.cartDetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
        this.progressBarService.hide();

        if ( this.cartDetails && this.cartDetails.Remark !== '') {
          this.toastr.error(this.cartDetails.Remark);
        }
        if (this.cartDetails && this.cartDetails.ListCartItem) {
          this.cartService.cartItemCount.next(this.cartDetails.ListCartItem.length);
        }
        this.doStockAvailabilityCheck();
      });
  }

  onPickup() {
    this.cartDetails.PaymentTypeId = 0;
    this.cartDetails.AddressId = 0;
    this.cartDetails.OrderTypeId = 1;
    this.navigateURL();
  }

  onDelivery() {
    this.cartDetails.OrderTypeId = 2;
    this.cartDetails.PaymentTypeId = 1;
    const tip = this.cartDetails.ListCharge.filter(charge => charge.ChargeTitle === 'Tip')[0];
    if (tip) {
      this.cartDetails.TipForDriver = tip.ChargeAmount;
    } else {
      this.cartDetails.TipForDriver = -1;
    }

    this.navigateURL();
  }

  navigateURL() {
    this.progressBarService.show();
    let cartbody: any;
    cartbody  = {
      IsFromCheckOut: false,
      IsToCallDSP: true
    };
    this.cartService.getCartDetails(cartbody).subscribe(
      (data: any) => {
        this.cartDetails = data;
        this.progressBarService.hide();

        if ( data && data.Remark !== '') {
          this.toastr.error(data.Remark);
          return;
        } else {
          if (this.type === 'pickup') {
            this.router.navigate(['/checkout']);
          } else {
            this.doStockAvailabilityCheck();
            if (this.delcheckout === 'y') {
              this.router.navigate(['/checkout']);
            }
          }
        }

      });
  }

  getQty (item: any) {
    if (item && item.DealId !== 0 && item.IsBottleLimitAtRetail === false && item.DealInventory > 0) {
      return this.quantity.filter(qty => qty <= item.DealInventory);
    }
    return this.quantity;
  }

}
