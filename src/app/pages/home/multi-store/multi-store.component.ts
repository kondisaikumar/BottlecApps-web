import { Component, OnChanges, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-multi-store',
  templateUrl: './multi-store.component.html',
  styleUrls: ['./multi-store.component.scss']
})
export class MultiStoreComponent implements OnChanges {
  @Input() stores: any;
  @Input() currentStore: any;
  @Output() storeChange = new EventEmitter<number>();
  @ViewChild('openModal') openModal: ElementRef;
  searchText: string;
  tempStores: any;

  constructor() {

  }

  ngOnChanges() {
  }

  /* onStoreSelect(storeId: number) {
    this.currentStore = storeId;
  } */

  onStoreSelectConfirm(storeId: number) {
    this.currentStore = storeId;
    localStorage.setItem('storeId', this.currentStore.toString());
    this.storeChange.emit(this.currentStore);
    this.openModal.nativeElement.click();
  }


  filterBySearchText() {
    if (this.stores && !this.tempStores) {
      this.tempStores = this.stores.map(obj => {
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

    this.stores = this.tempStores;
    this.stores = this.stores.filter(item =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
          .includes(this.searchText.toLowerCase()))
    );
  }

}
