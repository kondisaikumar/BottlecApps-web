import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../app-config.service';
@Component({
  selector: 'app-downloadapp',
  templateUrl: './downloadapp.component.html',
  styleUrls: ['./downloadapp.component.scss']
})
export class DownloadappComponent implements OnInit {
  downloadapp = '';
  constructor(private authenticationService: AppConfigService) {
    this.downloadapp = this.authenticationService.downloadapp;
  }

  ngOnInit() {
  }

}
