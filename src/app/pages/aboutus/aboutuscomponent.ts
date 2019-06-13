import { Component, OnInit } from '@angular/core';
import { ProductStoreService } from '../../services/product-store.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {

  storeDetails: any;
  constructor(private storeService: ProductStoreService) {}

  ngOnInit() {
    this.getStoreDetails();
  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
      }
    });
  }

}
