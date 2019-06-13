import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { DataService } from '../../../services/data.service';
import * as menuOptions from '../../../shared/store-filters.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  storeGetHomeData: any;
  activeURL: string;
  activeMenu: string;
  menuItems = [
    { name: 'Featured Products', url: '/feature-products' }
  ];

  isClicked = false;
  filterMenuItems: any;
  receipeMenuItem: any;
  couponMenuItem: any;
  eventsMenuItem: any;
  eventsList: any;

  constructor(private store: Store<any>, private router: Router, public dataservice: DataService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
        if (pssd && pssd.EventList) {
          this.eventsList = pssd.EventList;
        }
      });

    this.router.events.subscribe((val) => {
      this.activeURL = this.router.url;
    });
  }

  ngOnInit() {
    this.updateMenuItems();
  }

  updateMenuItems() {

    if (menuOptions && menuOptions['StoreFilters']) {
      this.filterMenuItems = menuOptions['StoreFilters'];
    }

    if (menuOptions && menuOptions['IsRecipes'] !== undefined) {
      if (menuOptions['IsRecipes']) {
        this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
      }
    } else {
      this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
    }
    if (menuOptions && menuOptions['IsCouponAvailable'] !== undefined) {
      if (menuOptions['IsCouponAvailable']) {
        this.couponMenuItem = { name: 'Coupons', url: '/coupons' };
      }
    }

    this.eventsMenuItem = { name: 'Events', url: '/events' };
  }

  showProducts(catId, catName) {
    this.isClicked = true;
    this.dataservice.searchByText = '';
    this.dataservice.categoryId = catId;
    this.dataservice.getFiltersByCategory();
    if (catName === 'Mixers & More') {
      catName = 'mixers-more';
    }
    this.router.navigate([`/${catName.toLowerCase()}`]);
  }

  onApplyFilter() {
    this.isClicked = true;
  }
  getMenuName(catName) {
    if (catName === 'Mixers & More') {
      catName = 'mixers-more';
    }
    return `/${catName.toLowerCase()}`;
  }

}

