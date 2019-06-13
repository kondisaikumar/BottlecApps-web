import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressInsert } from '../../../../models/address-insert';
import { CustomerService } from '../../../../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  editAddress: any;
  formEditAddress: FormGroup;
  submitted = false;
  returnUrl: string;
  constructor(private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private formBuilder: FormBuilder) {

    this.formEditAddress = this.formBuilder.group({
      aFirstName: ['', [Validators.required, Validators.minLength(2)]],
      aLastName: ['', [Validators.required]],
      aAddressName: ['', []],
      aAddress1: ['', [Validators.required]],
      aAddress2: ['', []],
      aCity: ['', [Validators.required]],
      aState: ['', [Validators.required, Validators.maxLength(2)]],
      aZip: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
      aIsDefault: [false, []],
    });
  }

  ngOnInit() {
    const addressId = +this.route.snapshot.paramMap.get('id');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'myaccount/manage-addresses';

    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.editAddress = this.customerService.customerAddressList.ListAddress.filter(item => item.AddressId === addressId)[0];

      if (this.editAddress) {
        this.initializeAddress();
      }
    } else {
      this.progressBarService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          if (data) {
            const addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
            this.progressBarService.hide();
            this.editAddress = addressList.filter(item => item.AddressId === addressId)[0];

            if (this.editAddress) {
              this.initializeAddress();
            }
          }
        });
    }
  }

  initializeAddress() {

    this.formEditAddress = this.formBuilder.group({
      aFirstName: [this.editAddress.FirstName, [Validators.required, Validators.minLength(2)]],
      aLastName: [this.editAddress.LastName, []],
      aAddressName: [this.editAddress.AddressName, []],
      aAddress1: [this.editAddress.Address1, [Validators.required]],
      aAddress2: [this.editAddress.Address2, []],
      aCity: [this.editAddress.City, [Validators.required]],
      aState: [this.editAddress.State, [Validators.required, Validators.maxLength(2)]],
      aZip: [this.editAddress.Zip, [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
      aIsDefault: [this.editAddress.IsDefault, []],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.formEditAddress.controls; }

  onAddressUpdate() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formEditAddress.invalid) {
      return;
    }

    const address = {
      AddressId: this.editAddress.AddressId, FirstName: '', LastName: '', AddressName: '',
      Address1: '', Address2: '', City: '', State: '', Zip: '', Country: '', IsDefault: 0,
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    address.FirstName = this.formEditAddress.get('aFirstName').value;
    address.LastName = this.formEditAddress.get('aLastName').value;
    address.AddressName = this.formEditAddress.get('aAddressName').value;
    address.Address1 = this.formEditAddress.get('aAddress1').value;
    address.Address2 = this.formEditAddress.get('aAddress2').value;
    address.City = this.formEditAddress.get('aCity').value;
    address.State = this.formEditAddress.get('aState').value;
    address.Zip = this.formEditAddress.get('aZip').value;
    // address.Country = this.formAddNewAddress.get('aCountry').value;
    address.IsDefault = this.formEditAddress.get('aIsDefault').value === true ? 1 : 0;

    this.customerService.UpdateAddress(address).subscribe(
      (data) => {
        this.toastr.success(data.SuccessMessage);
        // this.router.navigate(['myaccount/manage-addresses']);
        this.router.navigate([this.returnUrl]);
      });
  }

}
