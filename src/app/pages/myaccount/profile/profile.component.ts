import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 profile: any;
 profileFirstLetter = '';
 profilePic = 'assets/Images/profile.png';
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        this.profile = data;

        if (this.profile && this.profile.ProfileImage !== '') {
          this.profilePic = this.profile.ProfileImage;
        } else if (this.profile && this.profile.FirstName) {
          this.profileFirstLetter = this.profile.FirstName.substr(0, 1);
        } else if (this.profile && this.profile.EmailId) {
          this.profileFirstLetter = this.profile.EmailId.substr(0, 1);
        }
    });
  }

}
