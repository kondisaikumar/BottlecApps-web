import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyAccountComponent implements OnInit {
  selectedOption: string;
  profileDetails: any;

  constructor(private router: Router,
    private customerService: CustomerService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.getCustomerProfile();
  }

  getCustomerProfile() {
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        this.profileDetails = data;
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
  }
  onOptionSelected(option: string) {
    this.selectedOption = option;

    if (option === 'payment') {

      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        () => {
          if (this.customerService.paymentTypeId === 1) {
            this.router.navigate(['myaccount/payment-methods']);
          } else if (this.customerService.paymentTypeId === 7) {
            this.router.navigate(['myaccount/vantiv-payment-methods']);
          }
        });
    }
  }
}
