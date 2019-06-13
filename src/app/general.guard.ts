import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CustomerLoginSession } from './models/customer-login-session';
import { CustomerSelectors } from './state/customer/customer.selector';

@Injectable({
    providedIn: 'root'
})
export class GeneralGuard implements CanActivate {
    customerSession: CustomerLoginSession;

    constructor(private store: Store<CustomerLoginSession>,
        private route: Router) {
        this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                this.customerSession = clsd;
            });
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if ((this.customerSession && this.customerSession.SessionId)) {
            return true;
        }
        this.route.navigate(['/home'], { queryParams: { returnUrl: state.url } });
        // this.route.navigate(['/home']);
        return false;
    }
}
