import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { baseUrl } from '../../../services/url-provider';
import { AppConfigService } from '../../../app-config.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  formSignIn: FormGroup;
  formForgotPwd: FormGroup;
  // customerSession: CustomerLoginSession;
  submitted = false;
  fpSubmitted = false;
  returnUrl: string;
  email: string;
  password: string;
  rememberMe: boolean;
  // forgotPwdEmail: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store<CustomerLoginSession>,
    private socialAuthService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private appConfig: AppConfigService,
    private customerService: CustomerService) {

    this.rememberMe = false;
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          // this.customerSession = clsd;
          this.progressBarService.hide();
        }
      });
  }

  ngOnInit() {
    this.formSignIn = this.formBuilder.group({
      eemail: ['', [Validators.required, Validators.email]],
      epassword: ['', Validators.required],
      rememberMe: [false]
    });
    this.formForgotPwd = this.formBuilder.group({
      fpemail: ['', [Validators.required, Validators.email]]
    });

    let demail = localStorage.getItem('email');
    let dpass = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe');

    if (demail && dpass && rememberMe) {
      demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);

      this.formSignIn = this.formBuilder.group({
        eemail: [demail || '', [Validators.required, Validators.email]],
        epassword: [dpass || '', Validators.required],
        rememberMe: [rememberMe || false]
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.formSignIn.controls; }
  get fp() { return this.formForgotPwd.controls; }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      // console.log(user);
      if (user) {
        this.store.dispatch(new CustomerLogin(
          this.appConfig.getLoginCustomerParams(user.email, '', 'F', user.id)));

        localStorage.setItem('email', user.email);
        localStorage.setItem('password', '');
        localStorage.setItem('rememberMe', 'false');
        localStorage.setItem('isSignIn', '1');
        localStorage.setItem('sourceId', user.id);
      }

    });
  }

  onSignIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formSignIn.invalid) {
      return;
    }

    this.progressBarService.show();
    this.email = this.formSignIn.get('eemail').value;
    this.password = this.formSignIn.get('epassword').value;
    this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(this.email, this.password, 'E')));
    this.doCaching();

  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  doCaching() {

    this.email = this.formSignIn.get('eemail').value;
    this.password = this.formSignIn.get('epassword').value;
    this.rememberMe = this.formSignIn.get('rememberMe').value;

    if (this.rememberMe && this.email && this.password && baseUrl) {
      const email = CryptoJS.AES.encrypt(this.email, baseUrl.substr(3)).toString();
      const password = CryptoJS.AES.encrypt(this.password, baseUrl.substr(3)).toString();

      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('rememberMe', this.rememberMe.toString());
      localStorage.setItem('isSignIn', '1');

      this.clearSessionStorage();
    } else if (!this.rememberMe && this.email && this.password && baseUrl) {
      const email = CryptoJS.AES.encrypt(this.email, baseUrl.substr(3)).toString();
      const password = CryptoJS.AES.encrypt(this.password, baseUrl.substr(3)).toString();

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      localStorage.setItem('isSignIn', '1');
      this.clearLocalStorage();
    }

  }

  clearLocalStorage() {
    /* const lemail = localStorage.getItem('email');
    const lpass = localStorage.getItem('password');
    const lrememberMe = localStorage.getItem('rememberMe');

    if (lemail && lpass && lrememberMe) { */
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('isSignIn');
    localStorage.removeItem('sourceId');
    // }
  }

  clearSessionStorage() {
    /* const semail = sessionStorage.getItem('email');
    const spass = sessionStorage.getItem('password');

    if (semail && spass) { */
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    localStorage.removeItem('sourceId');
    // }
  }

  onResetPassword() {
    this.fpSubmitted = true;

    // stop here if form is invalid
    if (this.formForgotPwd.invalid) {
      return;
    }

    this.progressBarService.show();
    const forgotPwdEmail = this.formForgotPwd.get('fpemail').value;
    this.customerService.forgotPassword(forgotPwdEmail).subscribe(data => {
      if (data && data.Mesaage) {
        this.toastr.success(data.Mesaage);
        this.progressBarService.hide();
        this.onCancel();
      }
    });
  }

  onCancel() {
    this.fpSubmitted = false;
    this.formForgotPwd = this.formBuilder.group({
      fpemail: ['', [Validators.required, Validators.email]]
    });
  }

}
