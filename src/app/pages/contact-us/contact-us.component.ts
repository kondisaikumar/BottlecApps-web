import { Component, OnInit } from '@angular/core';
import { ProductStoreService } from '../../services/product-store.service';
import { CustomerLoginSession } from '../../models/customer-login-session';
import { CustomerSelectors } from '../../state/customer/customer.selector';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { ContactUsService } from '../../services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  storeDetails: any;
  mapURL: SafeResourceUrl;
  formContactUs: FormGroup;
  submitted = false;

  constructor(
    public sanitizer: DomSanitizer,
    private store: Store<CustomerLoginSession>,
    private storeService: ProductStoreService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private contactUsService: ContactUsService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.getStoreDetails();
        }
      });
  }

  ngOnInit() {
    this.formContactUs = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
      phone: ['', [Validators.required]],
      subject: ['Website - Contact Us', [Validators.required, Validators.maxLength(1000)]],
      message: ['', []]
    });
  }

  get f() { return this.formContactUs.controls; }

  getStoreDetails() {
    this.progressBarService.show();
    this.storeService.getStoreDetails().subscribe(data => {
      this.progressBarService.hide();
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
        const url = `https://maps.google.com/maps?q=${this.storeDetails.Latitude},${this.storeDetails.Longitude}&hl=es;z=14&output=embed` ;
        this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.formContactUs.invalid) {
      return;
    }

    const contactUsRequestPayload = {
      ContactUsEmail: this.formContactUs.get('email').value,
      Subject: this.formContactUs.get('subject').value,
      Message: this.formContactUs.get('message').value,
      Phone: this.formContactUs.get('phone').value,
      Name: this.formContactUs.get('name').value,
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    // contactUsRequestPayload.Phone.replace(/[()-]/g, '').substring(0,10)
    if (contactUsRequestPayload.Phone.length > 14) {
      contactUsRequestPayload.Phone = contactUsRequestPayload.Phone.substring(0, 14);
    }

    this.progressBarService.show();
    this.contactUsService.SendContactUsMessage(contactUsRequestPayload).subscribe((res) => {
      if (res && res.SuccessMessage !== '') {
        this.toastr.success(res.SuccessMessage);
        this.formContactUs.reset();
        this.formContactUs.controls['subject'].setValue('Website - Contact Us');
        this.submitted = false;
      } else {
        this.toastr.error(res.ErrorMessage);
      }
      this.progressBarService.hide();
    },
      error => {
        this.toastr.error(error);
        this.progressBarService.hide();
      });
  }

}
