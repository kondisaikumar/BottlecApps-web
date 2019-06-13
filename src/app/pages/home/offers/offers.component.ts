import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offer = '';
  constructor(private authenticationService: AppConfigService) {
    this.offer = this.authenticationService.offer;
  }
  ngOnInit() {
  }
}
