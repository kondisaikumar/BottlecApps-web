import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { ProductStoreService } from '../../../services/product-store.service';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  /* storeGetHomeData: any;
  constructor(private store: Store<any>) {
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
      });
  } */
  partners = '';
  storeDetails: any;
  constructor(private store: Store<CustomerLoginSession>,
    private storeService: ProductStoreService, private authenticationService: AppConfigService) {
    this.partners = this.authenticationService.partners;

    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.getStoreDetails();
        }
      });

  }
  ngOnInit() {
  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
      }
    });
  }
}
