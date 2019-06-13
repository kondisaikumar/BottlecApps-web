import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { VantivPaymentProfile } from '../models/vantiv-payment-profile';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { Store } from '@ngrx/store';
import { VantivBillingAddress } from '../models/vantiv-billing-address';
import { baseUrl, UrlNames } from '../services/url-provider';
import { CartService } from '../services/cart.service';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
    providedIn: 'root'
})
export class VantivPaymentServerSideApiService {
    headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    options = {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml; charset=utf-8' }),
        responseType: 'text' as 'text'
    };
    customerSession: CustomerLoginSession;
    customerInfo: any;
    vantiveProfile: VantivPaymentProfile;
    billingAddress: VantivBillingAddress;
    vUserSelectedPaymentAccountID = '';
    vErrorTransactionID = '';
    vRequest = '';
    vResponse = '';
    vRootName = '';
    vIsSuccess: number;
    vTransactionSetupID = '';
    vTransactionID = '';
    vPaymentAccountID = '';
    vExpressResponseCode = '';

    constructor(private http: HttpClient,
        private store: Store<CustomerLoginSession>,
        private errorHandler: ErrorHandlerService,
        private ngxXml2jsonService: NgxXml2jsonService,
        private cartService: CartService) {
        this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                if (clsd) {
                    this.customerSession = clsd;
                    this.vantiveProfile = new VantivPaymentProfile();
                    this.billingAddress = new VantivBillingAddress();
                }
            });
    }

    setVantivProfile(data: any) {
        if (!data) {
            return;
        }
        this.vantiveProfile = new VantivPaymentProfile();

        this.vantiveProfile.paymentTypeId = data.PaymentTypeId;
        this.vantiveProfile.paymentType = data.PaymentType;
        this.vantiveProfile.credential1 = data.Credential1;
        this.vantiveProfile.credential2 = data.Credential2;
        this.vantiveProfile.credential3 = data.Credential3;
        this.vantiveProfile.credential4 = data.Credential4;
        this.vantiveProfile.credential5 = data.Credential5;
        this.vantiveProfile.credential6 = data.Credential6;
        this.vantiveProfile.credential7 = data.Credential7;
        this.vantiveProfile.userProfileId = data.UserProfileId;
        this.vantiveProfile.isDefault = data.IsDefault;
        this.vantiveProfile.isLive = data.IsLive;

    }

    setBillingAddress(data: any) {
        this.billingAddress.addressEditAllowed = 1;
        this.billingAddress.billingName = data.AddressName || '';
        this.billingAddress.address1 = data.Address1 || '';
        this.billingAddress.city = data.City || '';
        this.billingAddress.state = data.State || '';
        this.billingAddress.zipcode = data.Zip || '';
        this.billingAddress.email = data.email || '';
        this.billingAddress.phone = data.ContactNo || '';
    }

    setupTransactionID(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.VantivGetSetUpTransactionId,
            this.getRequestPayload(), { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    this.parseSetupTransactionResponse(res);
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getRequestPayload() {
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

    private parseSetupTransactionResponse(res) {
        this.vTransactionSetupID = res.TransactionSetupID;
    }

    onCardValidationSuccessGetTransactionDetails(tSetupId: string): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.VantivGetQueryDetails,
            this.getTransactionDetailsOnCardValidationSuccessRequestPayload(tSetupId),
            { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    this.saveUpdatedBillingDetails(res);
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getTransactionDetailsOnCardValidationSuccessRequestPayload(tSetupId: string) {
        if (!this.customerSession || !tSetupId) {
            return null;
        }

        return {
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType,
            TransactionSetupID: tSetupId
        };
    }

    private saveUpdatedBillingDetails(data) {
        if (data && data.QueryTransactionDetails && data.QueryTransactionDetails.length > 0) {

            const item = data.QueryTransactionDetails[0];

            this.billingAddress.addressEditAllowed = 1;
            this.billingAddress.billingName = item.BillingName || this.billingAddress.billingName;
            this.billingAddress.address1 = item.BillingAddress1 || this.billingAddress.address1;
            this.billingAddress.city = item.BillingCity || this.billingAddress.city;
            this.billingAddress.state = item.BillingState || this.billingAddress.state;
            this.billingAddress.zipcode = item.BillingZipCode || this.billingAddress.zipcode;
            this.billingAddress.email = item.BillingEmail || this.billingAddress.email;
            this.billingAddress.phone = item.BillingPhone || this.billingAddress.phone;

            this.vTransactionID = item.TransactionId || '';
        }
    }

    OnSuccessParseDetailsForAddCardRequest(): Observable<any> {

        return this.http.post<any>(baseUrl + UrlNames.VantivAddCard,
            this.onSuccessParseDetailsForAddCardRequestPayload(),
            { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    this.savePaymentAccountID(res);
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private onSuccessParseDetailsForAddCardRequestPayload() {

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
            TransactionId: this.vTransactionID,
            BillingName: this.billingAddress.billingName,
            BillingAddress1: this.billingAddress.address1,
            BillingCity: this.billingAddress.city,
            BillingState: this.billingAddress.state,
            BillingZipcode: this.billingAddress.zipcode,
            BillingEmail: this.billingAddress.email,
            BillingPhone: this.billingAddress.phone
        };
    }

    private savePaymentAccountID(data) {
        if (data && data.PaymentAccountID) {
            this.vPaymentAccountID = data.PaymentAccountID;
        }
    }

    getAddedCards(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.VantivCardsGetList,
            this.getRequestPayload(), { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    this.parseSetupTransactionResponse(res);
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    CreditCardPayment(vTotalValue: number): Observable<any> {

        return this.http.post<any>(baseUrl + UrlNames.VantivCardPayment,
            this.getCardPaymentRequestPayload(vTotalValue),
            { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    this.parseCardPaymentResponse(res);
                    res.TransactionResponse = this.parseXML2Json(res.TransactionResponse);
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }

    private getCardPaymentRequestPayload(vTotalValue: number) {
        if (!this.customerSession) {
            return null;
        }

        const cartId = (this.cartService.cartdetails && this.cartService.cartdetails.CartId) || '';
        const vRefIdVantiv = `${this.customerSession.UserId}-${cartId}`;

        return {
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType,
            PaymentAccountID: this.vUserSelectedPaymentAccountID,
            TransactionAmount: vTotalValue,
            TicketNumber: vRefIdVantiv
        };
    }

    private parseCardPaymentResponse(res) {
        this.vExpressResponseCode = res.ExpressResponseCode || null;

        if (this.vExpressResponseCode === '1001' || this.vExpressResponseCode === '1002') {
            this.vErrorTransactionID = res.Transaction.TransactionID;
        }
    }

    CreditCardReversal(vTotalValue: number): Observable<any> {

        return this.http.post<any>(baseUrl + UrlNames.VantivCardReversal,
            this.getCreditCardReversalRequestPayload(vTotalValue),
            { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );

    }

    private getCreditCardReversalRequestPayload(vTotalValue: number) {

        if (!this.customerSession) {
            return null;
        }

        const cartId = (this.cartService.cartdetails && this.cartService.cartdetails.CartId) || '';
        const vRefIdVantiv = `${this.customerSession.UserId}-${cartId}`;

        return {
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType,
            PaymentAccountID: this.vUserSelectedPaymentAccountID,
            TransactionAmount: vTotalValue,
            TicketNumber: vRefIdVantiv,
            TransactionId: this.vErrorTransactionID
        };
    }

    deletePaymentMethod(paymentAccountID: string): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.VantivCardDelete,
            this.getPaymentAccountDeleteRequest(paymentAccountID), { headers: this.headers }).pipe(
                switchMap((res: any) => {
                    return of(res);
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return this.errorHandler.processError(error);
                })
            );
    }
    private getPaymentAccountDeleteRequest(paymentAccountID: string) {
        if (!this.customerSession || !paymentAccountID) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType,
            PaymentAccountID: paymentAccountID,
        };
    }

    parseXML2Json(data) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        console.log(obj);
        return obj;
    }
}
