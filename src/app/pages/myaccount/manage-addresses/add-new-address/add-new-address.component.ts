import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressInsert } from '../../../../models/address-insert';
import { CustomerService } from '../../../../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss']
})
export class AddNewAddressComponent implements OnInit {
  formAddNewAddress: FormGroup;
  submitted = false;
  returnUrl: string;
  constructor(private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'myaccount/manage-addresses';

    this.formAddNewAddress = this.formBuilder.group({
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

    /* this.formAddNewAddress = new FormGroup({
      aFirstName: new FormControl(''),
      aLastName: new FormControl(''),
      aAddressName: new FormControl(''),
      aAddress1: new FormControl(''),
      aAddress2: new FormControl(''),
      aCity: new FormControl(''),
      aState: new FormControl(''),
      aZip: new FormControl(''),
      // aCountry: new FormControl(''),
      aIsDefault: new FormControl(false),
    }); */
  }

    // convenience getter for easy access to form fields
  get f() { return this.formAddNewAddress.controls; }

  onAddressSave() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.formAddNewAddress.invalid) {
      return;
    }

    const address = {FirstName: '', LastName: '', AddressName: '',
    Address1: '', Address2: '', City: '', State: '', Zip: '', Country: '', IsDefault: 0,
    StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''};

    address.FirstName = this.formAddNewAddress.get('aFirstName').value;
    address.LastName = this.formAddNewAddress.get('aLastName').value;
    address.AddressName = this.formAddNewAddress.get('aAddressName').value;
    address.Address1 = this.formAddNewAddress.get('aAddress1').value;
    address.Address2 = this.formAddNewAddress.get('aAddress2').value;
    address.City = this.formAddNewAddress.get('aCity').value;
    address.State = this.formAddNewAddress.get('aState').value;
    address.Zip = this.formAddNewAddress.get('aZip').value;
    // address.Country = this.formAddNewAddress.get('aCountry').value;
    address.IsDefault = this.formAddNewAddress.get('aIsDefault').value === true ? 1 : 0;

    this.customerService.AddNewAddress(address).subscribe(
      (data) => {
        this.toastr.success(data.SuccessMessage);
        this.router.navigate([this.returnUrl]);
      });
  }
}
