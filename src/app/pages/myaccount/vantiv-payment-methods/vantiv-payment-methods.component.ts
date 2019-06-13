import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { VantivPaymentServerSideApiService } from '../../../services/vantiv-payment-serverside-api.service';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vantiv-payment-methods',
  templateUrl: './vantiv-payment-methods.component.html',
  styleUrls: ['./vantiv-payment-methods.component.scss']
})
export class VantivPaymentMethodsComponent implements OnInit {
  vantivPaymentProfiles: any;
  constructor(
    private progressBarService: ProgressBarService,
    private vantivPaymentService: VantivPaymentServerSideApiService,
    private customerService: CustomerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.vantivPaymentProfiles = [];

    if (!(this.vantivPaymentService.vantiveProfile && this.vantivPaymentService.vantiveProfile.credential1 !== undefined)) {
      this.progressBarService.show();
      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        () => {
          this.getExistingCardDetailsForVantiv();
        });

    } else {
      this.getExistingCardDetailsForVantiv();
    }
  }

  getExistingCardDetailsForVantiv() {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.vantivPaymentProfiles = [];

    this.progressBarService.show();
      this.vantivPaymentService.getAddedCards().subscribe(
        data => {
          // data.PaymentAccountQueryResponse.Response.QueryData.Items.Item.TruncatedCardNumber
          if (data && data.VantivCardList) {
            // this.vantivPaymentProfiles = data.PaymentAccountQueryResponse.Response.QueryData.Items.Item;
            this.vantivPaymentProfiles = [...this.vantivPaymentProfiles,
              ...data.VantivCardList];

          } else if (data && data.ExpressResponseCode === 101) {
            this.toastr.error(data.ExpressResponseMessage);
          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });

  }
  deletePaymentMethod(profile) {
    this.progressBarService.show();
    this.vantivPaymentService.deletePaymentMethod(
      profile.PaymentAccountID).subscribe(
        data => {
          if (data && data.ExpressResponseCode === '0') {
            this.toastr.success(data.ExpressResponseMessage);
            this.progressBarService.hide();
            this.getExistingCardDetailsForVantiv();
          } else {
            this.toastr.error(data.ExpressResponseMessage);
          }
        });
  }
}
