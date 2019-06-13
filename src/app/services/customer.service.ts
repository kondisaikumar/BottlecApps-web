import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { CustomerLoginRequestPayload } from '../models/customer-login-request-payload';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHomeRequestPayload } from '../models/store-get-home-request-payload';
import { baseUrl, UrlNames } from './url-provider';
import { BaseRequest } from '../models/base-request';
import { AddressInsert } from '../models/address-insert';
import { AddressUpdate } from '../models/address-update';
import { AddressDelete } from '../models/address-delete';
import { CustomerProfileUpdate } from '../models/customer-profile-update';
import { CustomerPaymentInsert } from '../models/customer-payment-insert';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { CustomerLogin } from '../state/customer/customer.action';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../shared/services/progress-bar.service';
import { AppConfigService, ValidationsModes, AuthorizeNetURLs } from '../app-config.service';
import { VantivPaymentServerSideApiService } from '../services/vantiv-payment-serverside-api.service';
import { ProductStoreService } from '../services/product-store.service';

@Injectable()
export class CustomerService {
  customerSession: CustomerLoginSession;
  private profileDetails: any;
  customerAddressList: any;
  customerPaymentMethodGetList: any;
  isPayAtStore = false;
  isPayOnline = false;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  paymentTypeId: number;
  profileUpdated = new Subject<any> ();

  constructor(private http: HttpClient,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private store: Store<CustomerLoginSession>,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private appConfig: AppConfigService,
    private vantivPaymentService: VantivPaymentServerSideApiService,
    private productStoreService: ProductStoreService) {
    /* if (this.appConfig.deviceID === '') {
      this.appConfig.deviceID = Math.random().toString(36).substring(2);
    } */
  }

  loginCustomer(reqParams: CustomerLoginRequestPayload): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.LoginCustomer, reqParams, { headers: this.headers }).pipe(
      switchMap((res: any) => {
        this.profileDetails = null;
        this.customerPaymentMethodGetList = null;
        if ((res.ErrorDetail && res.ErrorDetail !== '') || (res.ErrorMessage && res.ErrorMessage !== '')) {
          this.toastr.error(res.ErrorDetail);
          this.progressBarService.hide();

          const demail = localStorage.getItem('email');
          const dpass = localStorage.getItem('password');

          if (demail && dpass) {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('isSignIn');
            this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));
          }
        } else if (res.SessionId && res.SessionId !== '') {
          this.customerSession = res;
          this.authService.setSessionToken(res.SessionId);
          this.authService.setUserId(res.UserId);
          this.productStoreService.storeDetails = null;
          return of(res);
        } else {
          this.toastr.error('Internal Server Error.');
          this.progressBarService.hide();
          return EMPTY;
        }
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  getProfileDetails(): Observable<any> {

    if (this.profileDetails) {
      return of(this.profileDetails);
    }
    return this.http.post<any>(baseUrl + UrlNames.ProfileGetDetail, this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        this.profileDetails = res;
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  private getProfileDetailsRequestParams(): BaseRequest {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType
    };
  }

  updateCustomerProfile(profile: CustomerProfileUpdate): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerProfileUpdate,
      this.updateProfileDetails(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.profileDetails = res;
          this.profileUpdated.next();
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  UploadImage(image: any): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.UploadImage,
      image).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerAddressList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerAddressGetList,
      this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = res;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  AddNewAddress(address: AddressInsert): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressInsert,
      this.updateProfileDetails(address), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  UpdateAddress(address: AddressUpdate): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressUpdate,
      this.updateProfileDetails(address), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  DeleteAddress(addressId: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.AddressDelete,
      this.getDeleteAddressParams(addressId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerAddressList = null;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getDeleteAddressParams(addressId: number): AddressDelete {
    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      AddressId: addressId
    };
  }

  updateProfileDetails(address: any): any {

    if (!this.customerSession) {
      return address;
    }

    address.StoreId = this.customerSession.StoreId;
    address.SessionId = this.customerSession.SessionId;
    address.UserId = this.customerSession.UserId;
    address.AppId = this.customerSession.AppId;
    address.DeviceId = this.customerSession.DeviceId;
    address.DeviceType = this.customerSession.DeviceType;

    return address;
  }

  getCustomerPaymentMethodGetList(): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerPaymentMethodGetList,
      this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerPaymentMethodGetList = res;
          this.getPaymentTypes();
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getPaymentTypes() {
    if (this.customerPaymentMethodGetList && this.customerPaymentMethodGetList.ListPaymentItem) {

      const payAtStore = this.customerPaymentMethodGetList.ListPaymentItem.filter(
        item => item.PaymentTypeId === 2)[0];

      if (payAtStore) {
        this.isPayAtStore = true;
      }

      const payOnline = this.customerPaymentMethodGetList.ListPaymentItem.filter(
        item => (item.PaymentTypeId === 1 || item.PaymentTypeId === 7))[0];

      if (payOnline) {
        this.isPayOnline = true;
        this.paymentTypeId = payOnline.PaymentTypeId;
      }

      const cardPayment = this.customerPaymentMethodGetList.ListPaymentItem.filter(
        item => (item.PaymentType === 'Card Payment' || item.PaymentTypeId === 1))[0];

        if (cardPayment) {

          if (cardPayment.Credential3 === 'L') {
            this.appConfig.validationMode = ValidationsModes.live;
            this.appConfig.URL = AuthorizeNetURLs.prod_URL;
          } else {
            this.appConfig.validationMode = ValidationsModes.test;
            this.appConfig.URL = AuthorizeNetURLs.sandBox_URL;
          }

          if (cardPayment.Credential1 && cardPayment.Credential2 && cardPayment.Credential3) {
            this.decryptionKeyandTransaction(
              cardPayment.Credential1, cardPayment.Credential2, cardPayment.Credential3, this.customerPaymentMethodGetList.StoreId);
          }
        }
      const vantiv = this.customerPaymentMethodGetList.ListPaymentItem.filter(
        item => (item.PaymentType === 'Vantiv' || item.PaymentTypeId === 7))[0];

      if (vantiv) {
        this.vantivPaymentService.setVantivProfile(vantiv);
      }
    }
  }

  decryptionKeyandTransaction(Credential1, Credential2, Credential3, StoreID) {
    this.appConfig.decryptionKeyandTransaction(Credential1, Credential2, Credential3, StoreID);
  }

  customerPaymentInsert(userProfileId: string, isDefault: boolean, paymentTypeId: number): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.CustomerPaymentInsert,
      this.getCustomerPaymentInsertRequestParams(userProfileId, isDefault, paymentTypeId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          this.customerPaymentMethodGetList = null;
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCustomerPaymentInsertRequestParams(userProfileId: string, isDefault: boolean, paymentTypeId: number): CustomerPaymentInsert {
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
      UserProfileId: userProfileId,
      IsDefault: isDefault,
      IsCardDefault: isDefault,
      PaymentTypeId: paymentTypeId
    };

  }

  forgotPassword(email: string): Observable<any> {

    return this.http.post<any>(baseUrl + UrlNames.ForgotPassword,
      this.getForgotPasswordRequestParams(email), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  getForgotPasswordRequestParams(email: string): any {
    if (!this.customerSession) {
      return null;
    }

    return {
      AppId: this.customerSession.AppId,
      DeviceId: this.customerSession.DeviceId,
      DeviceType: this.customerSession.DeviceType,
      EmailId: email,
      StoreId: 0,
      SessionId: '',
      UserId: 0
    };

  }
}
