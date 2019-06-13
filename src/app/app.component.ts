import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import SmartBanner from 'smart-app-banner';
import { SmartBannerInfo } from './app-config.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  title = 'TeamBottlecApps';
  isMobile: boolean;
  storeId = 0;
  isAgeVerified = false;

  constructor(private deviceService: DeviceDetectorService,
    private router: Router,
    private commonService: CommonService) {
    new SmartBanner({
      daysHidden: 0,   // days to hide banner after close button is clicked (defaults to 15)
      daysReminder: 0, // days to hide banner after "VIEW" button is clicked (defaults to 90)
      appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
      title: SmartBannerInfo.title,
      author: SmartBannerInfo.author,
      button: 'View',
      store: {
        android: 'On the Google Play'
      },
      price: {
        android: 'GET'
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });

    this.commonService.cacheUpdated.subscribe(() => {
      this.verifyCache();
    });
  }

  ngOnInit() {
    this.verifyCache();
  }

  verifyCache() {
    if (localStorage.getItem('storeId')) {
      this.storeId = +localStorage.getItem('storeId');
    }

    if (localStorage.getItem('isAgeVerified') === 'true') {
      this.isAgeVerified = true;
    }

    // !this.isMobile &&
      if (
        !this.isAgeVerified ||
        !this.storeId ||
        this.storeId === 0
      ) {
        this.openModal.nativeElement.click();
      }
    }
}
