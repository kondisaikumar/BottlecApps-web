import { CustomerLoginRequestPayload } from '../../models/customer-login-request-payload';
import { CustomerActions, CustomerActionTypes, CustomerAction } from './customer.action';
import { CustomerLoginSession } from '../../models/customer-login-session';

export interface StateModel {
    customerLoginSessionData: CustomerLoginSession;
}

const initialState: StateModel = {
    customerLoginSessionData: null
};

export function customerReducer(state = initialState, action: CustomerAction): StateModel {

    switch (action.type) {

        case CustomerActionTypes.CustomerLoginSuccess: {
            return {
                ...state,
                customerLoginSessionData: action.payload
            };
        }

        default:
            return state;
    }
}
