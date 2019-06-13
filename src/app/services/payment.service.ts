import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { PaymentProfile } from '../models/payment-profile';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { ProductStoreService } from './product-store.service';
import { Store } from '@ngrx/store';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  /* URL = 'https://apitest.authorize.net/xml/v1/request.api';
  merchantAuthentication = {
    vAppLoginId: '5Pj5hE6a',
    vTransactionKey: '77Za8R4Wnx988xQs'
  }; */
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  customerInfo: any;
  createTransaction = {
    customerProfileId: '',
    customerPaymentProfileId: '',
    cvv: 0
  };

  constructor(private http: HttpClient,
    private store: Store<CustomerLoginSession>,
    private errorHandler: ErrorHandlerService,
    private productService: ProductStoreService,
    private appConfig: AppConfigService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
        }
      });
    if (this.productService.customerInfo) {
      this.customerInfo = this.productService.customerInfo;
    }
  }

  createCustomerProfile(profile: PaymentProfile): Observable<any> {
    return this.http.post<any>(this.appConfig.URL,
      this.getCreateCustomerProfileRequestPayload(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCreateCustomerProfileRequestPayload(profile: PaymentProfile) {
    if (!this.customerSession && !this.customerInfo) {
      return null;
    }

    return {
      'createCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': this.appConfig.merchantAuthentication.vAppLoginId,
          'transactionKey': this.appConfig.merchantAuthentication.vTransactionKey
        },
        'profile': {
          'merchantCustomerId': this.customerSession.UserId,
          'description': profile.description,
          'email': this.customerInfo.EmailId,
          'paymentProfiles': {
            'customerType': profile.customerType,
            'billTo': {
              'firstName': profile.firstName,
              'lastName': profile.lastName,
              'address': profile.address,
              'city': profile.city,
              'state': profile.state,
              'zip': profile.zip,
              'country': profile.country,
              'phoneNumber': profile.phoneNumber || this.customerInfo.ContactNo
            },
            'payment': {
              'creditCard': {
                'cardNumber': profile.cardNumber,
                'expirationDate': profile.expirationDate
              }
            },
            'defaultPaymentProfile': profile.defaultPaymentProfile
          }
        },
        'validationMode': profile.validationMode
      }
    };
  }

  createCustomerPaymentProfileRequest(profile: PaymentProfile): Observable<any> {
    return this.http.post<any>(this.appConfig.URL,
      this.getCreateCustomerPaymentProfileRequestPayload(profile), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  getCreateCustomerPaymentProfileRequestPayload(profile: PaymentProfile) {
    if (!this.customerSession && !this.customerInfo) {
      return null;
    }

    return {
      'createCustomerPaymentProfileRequest': {
        'merchantAuthentication': {
          'name': this.appConfig.merchantAuthentication.vAppLoginId,
          'transactionKey': this.appConfig.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profile.customerProfileId,
        'paymentProfile': {
          'billTo': {
            'firstName': profile.firstName,
            'lastName': profile.lastName,
            'address': profile.address,
            'city': profile.city,
            'state': profile.state,
            'zip': profile.zip,
            'country': profile.country,
            'phoneNumber': profile.phoneNumber
          },
          'payment': {
            'creditCard': {
              'cardNumber': profile.cardNumber,
              'expirationDate': profile.expirationDate
            }
          },
          'defaultPaymentProfile': profile.defaultPaymentProfile
        },
        'validationMode': profile.validationMode
      }
    };
  }
  getExistingCards(profileId: string): Observable<any> {
    return this.http.post<any>(this.appConfig.URL, this.getCustomerProfileRequestPayload(profileId), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  getCustomerProfileRequestPayload(profileId: string) {
    return {
      'getCustomerProfileRequest': {
        'merchantAuthentication': {
          'name': this.appConfig.merchantAuthentication.vAppLoginId,
          'transactionKey': this.appConfig.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profileId,
        'includeIssuerInfo': 'true'
      }
    };
  }

  deleteCustomerPaymentProfile(profileId: string, paymentProfileId: string): Observable<any> {
    return this.http.post<any>(this.appConfig.URL,
      this.deleteCustomerPaymentProfileRequestPayload(profileId, paymentProfileId), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  deleteCustomerPaymentProfileRequestPayload(profileId: string, paymentProfileId: string) {
    return {
      'deleteCustomerPaymentProfileRequest': {
        'merchantAuthentication': {
          'name': this.appConfig.merchantAuthentication.vAppLoginId,
          'transactionKey': this.appConfig.merchantAuthentication.vTransactionKey
        },
        'customerProfileId': profileId,
        'customerPaymentProfileId': paymentProfileId
      }
    };
  }

  createTransactionRequest(data): Observable<any> {
    return this.http.post<any>(this.appConfig.URL,
      this.createTransactionRequestPayload(data), { headers: this.headers }).pipe(
        switchMap((res: any) => {
          return of(res);
        }),
        catchError((error: any, caught: Observable<any>) => {
          return this.errorHandler.processError(error);
        })
      );
  }

  createTransactionRequestPayload(data) {
    return {
      'createTransactionRequest': {
        'merchantAuthentication': {
          'name': this.appConfig.merchantAuthentication.vAppLoginId,
          'transactionKey': this.appConfig.merchantAuthentication.vTransactionKey
        },
        'refId': this.getRefIdForAuthorizeNet(),
        'transactionRequest': {
          'transactionType': 'authOnlyTransaction',
          'amount': data.amount, // 22.09
          'profile': {
            'customerProfileId': this.createTransaction.customerProfileId,  // '{{vCustomerProfileId}}',
            'paymentProfile': {
              'paymentProfileId': this.createTransaction.customerPaymentProfileId, // '{{vCustomerPaymentProfileIdList}}',
              'cardCode': this.createTransaction.cvv // '353'
            }
          },
          'tax': {
            'amount': data.taxAmount, // 3.11,
            'name': data.taxType, // 'Sale Tax',
            'description': data.taxType // 'Sale Tax'
          }
        }
      }
    };
  }

  getRefIdForAuthorizeNet() {
    let refID = '';
    if (this.customerSession) {
      const userId = this.customerSession.UserId;
      const milliSec = Math.floor(Date.now() / 1000);
      refID = milliSec.toString() + userId;
    }
    return refID;
  }

}


