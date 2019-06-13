import { Component, OnInit } from '@angular/core';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  storeGetHomeData: any;
  constructor(private store: Store<CustomerLoginSession>) {
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
        }
      });
   }

  ngOnInit() {
  }

}
