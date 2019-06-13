import { Component, OnInit } from '@angular/core';
import { ProductStoreService } from '../../services/product-store.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../shared/services/progress-bar.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  couponsList: any;
  constructor(private storeService: ProductStoreService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.couponsList = null;
    this.getCouponsList();
  }

  getCouponsList() {
    if (this.storeService.couponsList && this.storeService.couponsList.Coupons) {
      this.couponsList = this.storeService.couponsList.Coupons;
    } else {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.storeService.couponsGetDetails().subscribe(
      (data: any) => {
        this.couponsList = data ? (data.Coupons ? data.Coupons : []) : [];
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
    }
  }

}
