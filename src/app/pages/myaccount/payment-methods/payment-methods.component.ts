import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {

  paymentMethodList: any;
  paymentProfiles: any;
  userProfileId: string;
  constructor(private customerService: CustomerService, private paymentService: PaymentService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.getPaymentMethodGetList();
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
    if (this.paymentMethodList && this.paymentMethodList.length > 0 &&
      this.paymentMethodList[0].UserProfileId) {
      this.userProfileId = this.paymentMethodList[0].UserProfileId;
      this.getExistingCardDetails(this.paymentMethodList[0].UserProfileId);
    } else {
      // this.spinnerService.hide();
      this.progressBarService.hide();
    }
  }

  getExistingCardDetails(userProfileId: string) {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.progressBarService.show();
    this.paymentProfiles = [];
    if (userProfileId !== '') {
      this.paymentService.getExistingCards(userProfileId).subscribe(
        data => {
          if ( data && data.profile && data.profile.paymentProfiles) {
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
  addToFavorite(card: any) {
    /* this.paymentProfiles.map(item => item.IsDefault = false);
    card.IsDefault = true; */
  }
  getCardType(paymentProfile): string {
    if (paymentProfile.payment.creditCard.cardType) {
      return `assets/Images/${paymentProfile.payment.creditCard.cardType.toLowerCase()}.png`;
    }
  }

  deletePaymentMethod(paymentProfile) {
    this.progressBarService.show();
    this.paymentService.deleteCustomerPaymentProfile(this.userProfileId,
      paymentProfile.customerPaymentProfileId).subscribe(data => {
        this.paymentProfiles.splice(this.paymentProfiles.indexOf(paymentProfile), 1);
        this.progressBarService.hide();
        // this.toastr.success(data.SuccessMessage);
    });
  }

}
