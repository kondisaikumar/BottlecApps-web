import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CartService } from '../../../services/cart.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  addressList: any;
  selectedAddress: number;
  cartDetails: any;
  deliveryDatesList: any;
  deliveryTimingsList: any;
  selectedDeliveryDate: any;
  selectedDeliveryTime: any;
  utcitem: any;
  constructor(private customerService: CustomerService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private cartService: CartService,
    private progressBarService: ProgressBarService,
    private toastr: ToastrService,
    private route: Router) { }

  ngOnInit() {
    this.cartDetails = this.cartService.cartdetails;
    if (this.cartDetails) {
      this.getDeliveryDates();
      this.getDeliveryTimings();
    }
    this.getAddressList();
  }

  getDeliveryDates() {
    this.deliveryDatesList = [];
    if (this.cartDetails && this.cartDetails.ListDoPTimeSlot) {
      this.cartDetails.ListDoPTimeSlot.forEach(slot => {
        if (this.deliveryDatesList.indexOf(slot.DoPDate) === -1) {
          this.deliveryDatesList.push(slot.DoPDate);
        }
      });

      if (this.cartDetails.DoPDate !== '') {
        this.cartDetails.DoPDate = new Date(this.cartDetails.DoPDate).toLocaleDateString();
      }

      if (this.deliveryDatesList.indexOf(this.cartDetails.DoPDate) >= 0) {
        this.selectedDeliveryDate = this.cartDetails.DoPDate;
      } else {
        this.selectedDeliveryDate = this.deliveryDatesList[0];
      }
      this.getDeliveryTimings();
    }
  }

  getDeliveryTimings() {

    this.cartService.cartdetails.DoPDate = this.selectedDeliveryDate;
    this.deliveryTimingsList = [];
    if (this.cartDetails && this.cartDetails.ListDoPTimeSlot) {
      this.deliveryTimingsList = this.cartDetails.ListDoPTimeSlot.filter(slot => slot.DoPDate === this.selectedDeliveryDate)
        .map(item => item.DoPSlot);
    }

    if (this.deliveryTimingsList.indexOf(this.cartDetails.DoPTimeSlot) >= 0) {
      this.selectedDeliveryTime = this.cartDetails.DoPTimeSlot;
    } else {
      this.selectedDeliveryTime = this.deliveryTimingsList[0];
      this.updateDeliveryTime();
    }
  }

  updateDeliveryTime() {
    // tslint:disable-next-line:max-line-length
    this.utcitem = this.cartDetails.ListDoPTimeSlot.filter(item => item.DoPDate === this.selectedDeliveryDate && item.DoPSlot === this.selectedDeliveryTime);
    this.cartDetails.DopUtcStartDate = this.utcitem[0].DSDopStartDate;
    this.cartDetails.DopUtcEndDate = this.utcitem[0].DSDopEndDate;
    this.cartService.cartdetails.DoPTimeSlot = this.selectedDeliveryTime;
    this.updateCart();
  }
  getAddressList() {
    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.addressList = this.customerService.customerAddressList.ListAddress;

      if (this.addressList.length === 1 && this.cartService.cartdetails.AddressId === 0) {
        this.cartService.cartdetails.AddressId = this.addressList[0].AddressId;
      }
    } else {
      // this.spinnerService.show();
      this.progressBarService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          this.addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
          this.addressList = this.addressList.sort((x, y) => x.IsDefault > y.IsDefault ? -1 : 1);
          if (this.addressList && this.addressList.filter(address => address.IsDefault === true).length > 0) {
            this.cartService.cartdetails.AddressId = this.addressList.filter(address => address.IsDefault === true)[0].AddressId;
          } else if (this.addressList.length === 1 && this.cartService.cartdetails.AddressId === 0) {
            this.cartService.cartdetails.AddressId = this.addressList[0].AddressId;
          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });
    }
  }

  onSelectAddress(address) {
    this.cartService.cartdetails.AddressId = address.AddressId;
    if (this.cartDetails && this.cartDetails.DeliveryAddress
      && this.cartDetails.DeliveryAddress.Remark !== '') {
      this.cartDetails.DeliveryAddress.Remark = '';
    }

    this.updateCart();
  }

  updateCart() {
    this.progressBarService.show();
    this.cartService.cartdetails.CartDsp = 'Y';
    this.cartService.cartdetails.IsFromCheckOut = true;
    this.cartService.cartdetails.IsToCallDSP = true;
    this.cartService.updateCart(this.cartService.cartdetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
        console.log('checkoutdeliverycomponent', this.cartDetails);
        this.progressBarService.hide();

        /* if ( this.cartDetails && this.cartDetails.DeliveryAddress
          && this.cartDetails.DeliveryAddress.Remark !== '') {
          this.toastr.error(this.cartDetails.DeliveryAddress.Remark);
        } */
      });
  }

  onAddAddress() {
    this.route.navigate(['/myaccount/add-new-address'], { queryParams: { returnUrl: this.route.url } });
  }

  onEditAddress(addressId) {
    // routerLink="/myaccount/edit-address/{{address.AddressId}}"
    this.route.navigate(['/myaccount/edit-address/' + addressId], { queryParams: { returnUrl: this.route.url } });
  }

}
