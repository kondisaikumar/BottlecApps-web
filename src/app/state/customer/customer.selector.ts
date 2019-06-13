import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromState from './customer.reducer';

export const customerState = createFeatureSelector<fromState.StateModel>('customer');

export const customerLoginSessionData = createSelector(
    customerState,
    (state) => {
        return state.customerLoginSessionData;
    }
);
export const CustomerSelectors = {
    customerLoginSessionData
};
