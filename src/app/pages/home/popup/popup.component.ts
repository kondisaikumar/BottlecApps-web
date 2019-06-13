import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { AppConfigService } from '../../../app-config.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { ProductStoreService } from '../../../services/product-store.service';
import { SessionService } from '../../../shared/services/session.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;

  isAgeVerified = false;
  currentStoreId = 0;
  storeList: any;
  searchText: string;
  tempStores: any;

  initialStoreId = 0;

  constructor(private router: Router,
    private store: Store<CustomerLoginSession>,
    private appConfig: AppConfigService,
    private progressBarService: ProgressBarService,
    private storeService: ProductStoreService,
    private sessionService: SessionService,
    private commonService: CommonService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
    .subscribe(clsd => {
      if (clsd) {
        if (!localStorage.getItem('storeId') && clsd.StoreId !== 0) {
          localStorage.setItem('storeId', clsd.StoreId.toString());
          this.currentStoreId = clsd.StoreId;
        }
        this.getStoreList();
      }
    });

  }

  ngOnInit() {
    this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));

    if (localStorage.getItem('isAgeVerified') === 'true') {
      this.isAgeVerified = true;
    }

    if (localStorage.getItem('storeId')) {
      this.currentStoreId = +localStorage.getItem('storeId');
    }
  }

  onAgeVerified(data) {
    this.isAgeVerified = data;

    if (this.isAgeVerified && this.currentStoreId !== 0) {
      this.commonService.onCacheUpdated();
      // this.sessionService.createNewSession();

      this.openModal.nativeElement.click();
    }
  }

  getStoreList() {
    this.progressBarService.show();
    this.storeService.storeGetList().subscribe(data => {
      if (data && data.ListStore) {
        this.currentStoreId = data.StoreId;
        this.initialStoreId = data.StoreId;

        const sList = data.ListStore;
        const fromIndex = sList.findIndex(item => item.StoreId === this.currentStoreId);

        if (fromIndex !== -1) {
          const element = sList[fromIndex];
          sList.splice(fromIndex, 1);
          sList.splice(0, 0, element);
        }

        this.storeList = sList;
        this.progressBarService.hide();
      }
    });
  }

  /* onStoreSelect(storeId: number) {
    this.currentStoreId = storeId;
    // this.storeChange.emit(storeId);
  } */
  onStoreSelectConfirm(storeId: number) {
    this.currentStoreId = storeId;
    localStorage.setItem('storeId', this.currentStoreId.toString());
    this.appConfig.storeID = this.currentStoreId;
    this.sessionService.createNewSession();
    this.commonService.onCacheUpdated();
  }

  filterBySearchText() {
    if (this.storeList && !this.tempStores) {
      this.tempStores = this.storeList.map(obj => {
        const rObj = {
          'StoreId' : obj.StoreId,
          'Address1': obj.Address1,
          'Address2': obj.Address2,
          'City': obj.City,
          'Location' : obj.Location,
          'Phone': obj.Phone,
          'State': obj.State,
          'ContactNo': obj.ContactNo,
          'StoreName': obj.StoreName,
          'Zip': obj.Zip,
          'StoreImage': obj.StoreImage
        };
        return rObj;
      });
    }
    console.log(this.searchText);

    this.storeList = this.tempStores;
    this.storeList = this.storeList.filter(item =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
          .includes(this.searchText.toLowerCase()))
    );
  }
}
