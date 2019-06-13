import { Injectable } from '@angular/core';

import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { RootStateModel } from '../../app.state';
import * as fromProductStore from '../product-store/product-store.action';
import { ProductStoreService } from '../../services/product-store.service';

@Injectable()
export class ProductStoreEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootStateModel>,
        private productStoreService: ProductStoreService) {
    }

    @Effect()
    getStoreHome$ = this.actions$
        .ofType(fromProductStore.ProductStoreActionTypes.StoreGetHome)
        .pipe(
            withLatestFrom<fromProductStore.StoreGetHome, RootStateModel>(this.store),
            switchMap(([action, state]) => {
                return this.productStoreService.getStoreHome().pipe(
                    map(p => {
                        return new fromProductStore.ProductStoreActions.StoreGetHomeSuccess(p);
                    }),
                    catchError(error =>
                        of(error)
                    )
                );
            })
        );
    @Effect()
    productGetList$ = this.actions$
        .ofType(fromProductStore.ProductStoreActionTypes.ProductGetList)
        .pipe(
            withLatestFrom<fromProductStore.ProductGetList, RootStateModel>(this.store),
            switchMap(([action, state]) => {
                return this.productStoreService.productGetList(action.payload).pipe(
                    map(p => {
                        return new fromProductStore.ProductStoreActions.ProductGetListSuccess(p);
                    }),
                    catchError(error =>
                        of(error)
                    )
                );
            })
        );
    @Effect()
    productGetDetails$ = this.actions$
        .ofType(fromProductStore.ProductStoreActionTypes.ProductGetDetails)
        .pipe(
            withLatestFrom<fromProductStore.ProductGetDetails, RootStateModel>(this.store),
            switchMap(([action, state]) => {
                return this.productStoreService.productGetDetails(action.payload).pipe(
                    map(p => {
                        return new fromProductStore.ProductStoreActions.ProductGetDetailsSuccess(p);
                    }),
                    catchError(error =>
                        of(error)
                    )
                );
            })
        );
    @Effect()
    eventGetDetails$ = this.actions$
        .ofType(fromProductStore.ProductStoreActionTypes.EventGetDetails)
        .pipe(
            withLatestFrom<fromProductStore.EventGetDetails, RootStateModel>(this.store),
            switchMap(([action, state]) => {
                return this.productStoreService.eventGetDetails(action.payload).pipe(
                    map(p => {
                        return new fromProductStore.ProductStoreActions.EventGetDetailsSuccess(p);
                    }),
                    catchError(error =>
                        of(error)
                    )
                );
            })
        );
}
