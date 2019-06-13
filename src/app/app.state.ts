import { ActionReducer, MetaReducer, ActionReducerMap } from '@ngrx/store';
import * as customer from './state/customer/customer.reducer';
import * as productStore from './state/product-store/product-store.reducer';

export interface RootStateModel {
    customer: customer.StateModel;
    productStore: productStore.StateModel;
}

export const reducers: ActionReducerMap<RootStateModel> = {
    customer: customer.customerReducer,
    productStore: productStore.productStoreReducer
};

export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        if (action.type === 'ClearState') {
            state = undefined;
        }

        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearState];
