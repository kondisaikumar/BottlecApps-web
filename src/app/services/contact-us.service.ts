import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY, Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { Store } from '@ngrx/store';
import { baseUrl, UrlNames } from './url-provider';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { ContactUs } from '../models/contact-us';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private store: Store<CustomerLoginSession>) {
      this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
     }

  SendContactUsMessage(profile: ContactUs): Observable<any> {

    if (!this.customerSession) {
      return null;
    }

    profile.StoreId =  this.customerSession.StoreId;
    profile.SessionId = this.customerSession.SessionId;
    profile.UserId = this.customerSession.UserId;
    profile.AppId = this.customerSession.AppId;
    profile.DeviceId = this.customerSession.DeviceId;
    profile.DeviceType = this.customerSession.DeviceType;

    return this.http.post<any>(baseUrl + UrlNames.StoreContactUs, profile, { headers: this.headers })
    .pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

}
