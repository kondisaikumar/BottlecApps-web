import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  cacheUpdated = new Subject<any>();
  orderPlaced = new Subject<boolean>();

  constructor() { }

  onCacheUpdated() {
    this.cacheUpdated.next();
  }

  onOrderPlaced(status: boolean) {
    this.orderPlaced.next(status);
  }
}
