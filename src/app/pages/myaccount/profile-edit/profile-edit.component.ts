import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profile: any;
  profileImage: string;
  submitted = false;

  formEditProfile: FormGroup;
  selectedFile: any;
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private progressBarService: ProgressBarService) {

    this.formEditProfile = this.formBuilder.group({
      pFirstName: ['', [Validators.required]],
      pLastName: ['', [Validators.required]],
      pContactNo: ['', [Validators.required]],
      pEmail: ['', [Validators.required, Validators.email]],
      pDOB: ['', []],
      pGender: ['', [Validators.required]],
      pImage: ['', []]
    });

    this.progressBarService.show();
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        if (data) {
          this.profile = data;
          this.profileImage = this.profile.ProfileImage;
          this.progressBarService.hide();
          this.initializeProfile();
        }
      });
  }

  ngOnInit() {
  }

  initializeProfile() {
    this.formEditProfile = this.formBuilder.group({
      pFirstName: [this.profile.FirstName, [Validators.required]],
      pLastName: [this.profile.LastName, [Validators.required]],
      pContactNo: [this.profile.ContactNo, [Validators.required]],
      pEmail: [this.profile.EmailId, [Validators.required, Validators.email]],
      pDOB: [this.profile.DOBDt ? new Date (this.profile.DOBDt) : '', []],
      pGender: [this.profile.Gender, []],
      pImage: [this.profile.ProfileImage, []]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.formEditProfile.controls; }

  uploadPicture(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.selectedFile = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = ((e) => {
        this.profileImage = e.target['result'];
      });
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onProfileUpdate() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.formEditProfile.invalid) {
      return;
    }

    this.progressBarService.show();
    if (this.selectedFile && this.selectedFile.name) {
      const uploadData = new FormData();
      uploadData.append('Image', this.selectedFile, this.selectedFile.name);

      this.customerService.UploadImage(uploadData).subscribe((res) => {
        if (res) {
          this.profileImage = res.SuccessMessage;
          this.updateProfile();
        }
      },
        error => {
          this.toastr.error(error);
          this.progressBarService.hide();
        });
    } else {
      this.updateProfile();
    }
  }

  private updateProfile() {

    const profile = {
      FirstName: '', LastName: '', EmailId: '',
      ContactNo: '', DOB: '', Gender: '', UserIpAddress: '', ProfileImage: this.profileImage,
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    profile.FirstName = this.formEditProfile.get('pFirstName').value;
    profile.LastName = this.formEditProfile.get('pLastName').value;
    profile.ContactNo = this.formEditProfile.get('pContactNo').value;
    profile.EmailId = this.formEditProfile.get('pEmail').value;
    if (this.formEditProfile.get('pDOB').value) {
      profile.DOB = this.formEditProfile.get('pDOB').value.toLocaleDateString();
    }
    profile.Gender = this.formEditProfile.get('pGender').value;

    this.customerService.updateCustomerProfile(profile).subscribe(
      (res) => {
        if (res) {
          this.toastr.success(res.SuccessMessage);
        }
        this.progressBarService.hide();
        this.router.navigate(['myaccount/profile']);
      },
        error => {
          this.toastr.error(error);
          this.progressBarService.hide();
        });
  }

}
