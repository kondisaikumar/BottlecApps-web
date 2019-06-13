import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../services/cart.service';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { Router } from '@angular/router';
import { VantivPaymentServerSideApiService } from '../../../services/vantiv-payment-serverside-api.service';

@Component({
  selector: 'app-checkout-payment-method',
  templateUrl: './checkout-payment-method.component.html',
  styleUrls: ['./checkout-payment-method.component.scss']
})
export class CheckoutPaymentMethodComponent implements OnInit {

  paymentMethodList: any;
  paymentProfiles: any;
  paymentProfilesForVantiv: any;
  userProfileId: string;
  selectedCard: number;
  cardCVV: number;
  storeDetails: any;
  orderTypeId: number;
  paymentTypeId: number;
  onlinePaymentTypeId: number;
  remarks: string;
  cartDetails: any;

  constructor(private customerService: CustomerService,
    private paymentService: PaymentService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private cartService: CartService,
    private storeService: ProductStoreService,
    private progressBarService: ProgressBarService,
    private route: Router,
    private vantivPaymentService: VantivPaymentServerSideApiService) { }

  ngOnInit() {
    this.getPaymentMethodGetList();
    this.getStoreDetails();
    this.orderTypeId = this.cartService.cartdetails.OrderTypeId;
    this.paymentTypeId = this.cartService.cartdetails.PaymentTypeId;
  }

  getPaymentMethodGetList() {
    if (this.customerService.customerPaymentMethodGetList && this.customerService.customerPaymentMethodGetList.ListPaymentItem) {
      this.paymentMethodList = this.customerService.customerPaymentMethodGetList.ListPaymentItem;
      this.getPaymentList();
    } else {
      // this.spinnerService.show();
      this.progressBarService.show();
      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        data => {
          this.paymentMethodList = data ? (data.ListPaymentItem ? data.ListPaymentItem : []) : [];
          this.getPaymentList();
        });
    }
  }

  getPaymentList() {

    const authorizeNet = this.paymentMethodList.filter(
      type => (type.PaymentType === 'Card Payment' || type.PaymentTypeId === 1))[0];

    if (authorizeNet) {
      this.onlinePaymentTypeId = 1;
      if (authorizeNet.UserProfileId) {
        this.userProfileId = authorizeNet.UserProfileId;
        this.paymentService.createTransaction.customerProfileId = authorizeNet.UserProfileId;
        this.getExistingCardDetails(authorizeNet.UserProfileId);
      }
    }

    const vantiv = this.paymentMethodList.filter(
      type => (type.PaymentType === 'Vantiv' || type.PaymentTypeId === 7))[0];

    if (vantiv) {
      this.onlinePaymentTypeId = 7;
      // this.userProfileId = vantiv.UserProfileId;
      // this.paymentService.createTransaction.customerProfileId = vantiv.UserProfileId;
      // if (vantiv.UserProfileId) {
      this.getExistingCardDetailsForVantiv();
      // }
    } else {
      // this.spinnerService.hide();
      this.progressBarService.hide();
    }

    if (this.paymentMethodList.length === 1 && this.onlinePaymentTypeId) {
      this.cartService.cartdetails.PaymentTypeId = this.onlinePaymentTypeId;
      this.paymentTypeId = this.onlinePaymentTypeId;
    }
  }

  changePaymentType(paymentType) {
    if (paymentType === 'payOnline') {
      this.cartService.cartdetails.PaymentTypeId = this.onlinePaymentTypeId;
      this.paymentTypeId = this.onlinePaymentTypeId;
    } else if (paymentType === 'payAtStore') {
      this.cartService.cartdetails.PaymentTypeId = 0;
      this.paymentTypeId = 0;
    }
  }

  getExistingCardDetails(userProfileId: string) {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.paymentProfiles = [];
    if (userProfileId !== '') {
      this.progressBarService.show();
      this.paymentService.getExistingCards(userProfileId).subscribe(
        data => {
          if (data && data.profile && data.profile.paymentProfiles) {
            this.paymentProfiles = data.profile.paymentProfiles;
          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });
    } else {
      // this.spinnerService.hide();
      this.progressBarService.hide();
    }
  }

  getExistingCardDetailsForVantiv() {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.paymentProfilesForVantiv = [];

    this.progressBarService.show();
      this.vantivPaymentService.getAddedCards().subscribe(
        data => {
          // data.PaymentAccountQueryResponse.Response.QueryData.Items.Item.TruncatedCardNumber
          if (data && data.VantivCardList) {
            // this.paymentProfilesForVantiv = data.PaymentAccountQueryResponse.Response.QueryData.Items.Item;
            this.paymentProfilesForVantiv = [...this.paymentProfilesForVantiv,
              ...data.VantivCardList];

          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        },
        error => {
          this.progressBarService.hide();
        });

  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
      }
    });
  }

  saveCVV() {
    this.paymentService.createTransaction.cvv = this.cardCVV;
  }

  updateSelectedPayment(paymentProfile) {
    this.cartService.cartdetails.PaymentTypeId = 1; // paymentProfile.customerPaymentProfileId;

    this.paymentService.createTransaction.customerPaymentProfileId = paymentProfile.customerPaymentProfileId;

  }

  updateSelectedPaymentForVantiv(paymentProfile) {
    this.cartService.cartdetails.PaymentTypeId = 7; // paymentProfile.customerPaymentProfileId;

    this.vantivPaymentService.vUserSelectedPaymentAccountID = paymentProfile.PaymentAccountID;
  }

  onAddNewPaymentMethod() {
    // [routerLink]="['/myaccount/add-new-payment-method']"
    if ( this.paymentTypeId === 1) {
      this.route.navigate(['/myaccount/add-new-payment-method'], { queryParams: { returnUrl: this.route.url } });
    } else {
      this.route.navigate(['/myaccount/add-new-card'], { queryParams: { returnUrl: this.route.url } });
    }
  }

  saveRemarks() {
    this.cartService.cartdetails.DeliveryInstruction = this.remarks;
    this.cartService.cartdetails.CartDsp = 'Y';
    this.cartService.cartdetails.IsFromCheckOut = true;
    this.cartService.cartdetails.IsToCallDSP = true;
    this.cartService.updateCart(this.cartService.cartdetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
      });
    this.cartService.userRemarks = this.remarks;
  }

}
