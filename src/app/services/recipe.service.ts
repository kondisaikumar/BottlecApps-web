import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { RecipeGetListRequestPayload } from '../models/recipe-get-list-request-payload';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  customerSession: CustomerLoginSession;
  // recipesList: any;
  selectedRecipe: any;

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

  getRecipeList(pageNo = 1): Observable<any> {
    return this.http.post<any>(baseUrl + UrlNames.RecipeGetList, this.getRecipeRequestParams(pageNo), { headers: this.headers }).pipe(
      switchMap((res: any) => {
        return of(res);
      }),
      catchError((error: any, caught: Observable<any>) => {
        return this.errorHandler.processError(error);
      })
    );
  }

  private getRecipeRequestParams(pageNo: number): RecipeGetListRequestPayload {
    if (!this.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerSession.StoreId,
      SessionId: this.customerSession.SessionId,
      UserId: this.customerSession.UserId,
      AppId: this.customerSession.AppId,
      PageNumber: pageNo,
      PageSize: 12
    };
  }
}
