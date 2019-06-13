import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductStoreService } from '../../../services/product-store.service';
@Component({
  selector: 'app-checkout-pickup',
  templateUrl: './checkout-pickup.component.html',
  styleUrls: ['./checkout-pickup.component.scss']
})
export class CheckoutPickupComponent implements OnInit {

  storeDetails: any;
  constructor(private store: Store<any>,
    private storeService: ProductStoreService) {
      this.storeService.getStoreDetails().subscribe(data => {
        if (data && data.GetStoredetails) {
          this.storeDetails = data.GetStoredetails;
        }
      });
  }

  ngOnInit() {
  }

}
