import { Action } from '@ngrx/store';
import { CustomerLoginRequestPayload } from '../../models/customer-login-request-payload';
import { CustomerLoginSession } from '../../models/customer-login-session';

export enum CustomerActionTypes {
    CustomerLogin = '[Customer] Login',
    CustomerLoginSuccess = '[Customer] LoginSuccess'
}

export class CustomerLogin implements Action {
    readonly type = CustomerActionTypes.CustomerLogin;

    constructor(public payload: CustomerLoginRequestPayload) { }
}

export class CustomerLoginSuccess implements Action {
    readonly type = CustomerActionTypes.CustomerLoginSuccess;

    constructor(public payload: CustomerLoginSession) { }
}

export const CustomerActions = {
    CustomerLogin,
    CustomerLoginSuccess
};

export type CustomerAction = CustomerLogin | CustomerLoginSuccess;
