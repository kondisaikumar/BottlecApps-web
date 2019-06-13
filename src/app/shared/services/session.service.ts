import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { baseUrl } from '../../services/url-provider';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { CustomerLogin } from '../../state/customer/customer.action';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from '../../models/customer-login-session';
// import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../../app-config.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerSelectors } from '../../state/customer/customer.selector';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private store: Store<CustomerLoginSession>,
    private progressBarService: ProgressBarService,
    // private customerService: CustomerService,
    private route: Router,
    private appConfig: AppConfigService,
    private toastr: ToastrService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd && (this.route.url !== '/home' && !this.route.url.startsWith('/home'))) {
          this.route.navigate(['/home'], { queryParams: { returnUrl: this.route.url } });
        }
      });
  }

  createNewSession() {

    let demail = sessionStorage.getItem('email');
    let dpass = sessionStorage.getItem('password');
    const sourceId = localStorage.getItem('sourceId');

    if (demail && dpass) {
      demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
    } else if (demail && sourceId) {
      this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(demail, '' , 'F', sourceId)));
    } else {
      demail = localStorage.getItem('email');
      dpass = localStorage.getItem('password');

      if (demail && dpass) {
        demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
        dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      }
    }

    this.progressBarService.show();
    // this.toastr.info('Refreshing');
    if (demail && dpass) {
      this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(demail, dpass, 'E')));
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('isSignIn');
      localStorage.removeItem('rememberMe');
      this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));
    }
  }
}
