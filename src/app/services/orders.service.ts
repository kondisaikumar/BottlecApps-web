import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { MyOrders } from '../models/my-orders';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;

  constructor(private http: HttpClient,
    private store: Store<CustomerLoginSession>,
    private errorHandler: ErrorHandlerService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
  }

  getMyOrdersList(pageNo = 1): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.OrderGetList, this.getMyOrdersRequestParams(pageNo), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  private getMyOrdersRequestParams(pageNo: number): MyOrders {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      PageNumber: pageNo,
      PageSize: 10
    };
  }

  cancelOrder(orderId): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.OrderCancel, this.getOrderCancelRequestParams(orderId), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  private getOrderCancelRequestParams(orderId: number): any {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      OrderId: orderId,
      StatusId: 1
    };
  }

  reOrder(orderId): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.ReOrderCart, this.getReOrderRequestParams(orderId), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  private getReOrderRequestParams(orderId: number): any {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      OrderId: orderId,
      ListPID: ''
    };
  }
}
