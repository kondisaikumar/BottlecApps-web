import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataFilterAllService } from '../../../services/data-filter-all.service';
import { ProductFilters } from '../../../models/product-filters';
import { Item } from '../../../models/item';
import { Country } from '../../../models/country';
import { ProductType } from '../../../models/product-type';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, NavigationEnd } from '@angular/router';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-advanced-filter-all',
  templateUrl: './advanced-filter-all.component.html',
  styleUrls: ['./advanced-filter-all.component.scss']
})
export class AdvancedFilterAllComponent implements OnInit {
  allFilterOptions: ProductFilters;
  selectedFilters: Item[] = [];
  selectedTypes: ProductType[] = [];
  selectedSizes: Item[] = [];
  selectedPrices: Item[] = [];
  selectedCountries: Country[] = [];
  allRegions: Item[] = [];
  selectedRegions: Item[] = [];
  allVarietals: Item[] = [];
  selectedVarietals: Item[] = [];
  productsList: any;
  totalProducts = 0;
  PageSize = [15, 30, 45, 60, 75, 90];
  SortBy = ['Price', 'Size', 'Type', 'Country', 'Region'];
  selectedPageSize = 15;
  navigationSubscription;
  page = 1;
  fromProductNo = 1;
  categoryList = [
    {id: 1, value: 'Beer', isSelected: false},
    {id: 2, value: 'Liquor', isSelected: false},
    {id: 3, value: 'Wine', isSelected: false},
    {id: 4, value: 'Mixers & More', isSelected: false}];
  selectedCategories: Item[] = [];

  constructor(public dataservice: DataFilterAllService,
    private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService,
    private progressBarService: ProgressBarService) {

    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
        this.totalProducts = pgld ? pgld.TotalCount : 0;
        this.fromProductNo = ((this.page - 1) * this.selectedPageSize ) + 1;
        this.progressBarService.hide();
      });
  }

  ngOnInit() {
    this.productsList = [];
    this.totalProducts = 0;
    this.fromProductNo = 0;
    this.initialiseSearchFilter();
    this.getAllRegions();
  }

  initialiseSearchFilter() {

    if (this.dataservice.searchByText && this.dataservice.searchByText !== '') {
      this.selectedFilters = [{ id: '001', value: this.dataservice.searchByText, isSelected: true }];
    }

    this.dataservice.categoryId = '1,2,3,4';
    this.dataservice.getFiltersByCategory();
    this.allFilterOptions = this.dataservice.filtersAllData;
    this.allVarietals = this.dataservice.allVarietals;
    this.getFilteredProducts();
  }

  getAllSelectedFilters() {
    this.selectedFilters = [];

    if (this.dataservice.searchByText && this.dataservice.searchByText !== '') {
      this.selectedFilters = [{ id: '001', value: this.dataservice.searchByText, isSelected: true }];
    }
    this.selectedCategories = this.getSelectedFilterOptions(this.categoryList);
    this.selectedTypes = this.getSelectedFilterOptions(this.allFilterOptions.type);
    this.selectedSizes = this.getSelectedFilterOptions(this.allFilterOptions.size);
    this.selectedPrices = this.getSelectedFilterOptions(this.allFilterOptions.price);

    this.selectedVarietals = this.getSelectedFilterOptions(this.allVarietals);

    if (this.allFilterOptions.countries.length > 0) {
      this.selectedCountries = this.getSelectedFilterOptions(this.allFilterOptions.countries);
      this.selectedRegions = this.getSelectedFilterOptions(this.allRegions);
    }

    this.selectedFilters = [
      ...this.selectedFilters, ...this.selectedCategories, ...this.selectedTypes,
      ...this.selectedVarietals, ...this.selectedSizes, ...this.selectedPrices,
      ...this.selectedCountries, ...this.selectedRegions];
  }

  onCategorySelectionChange(item) {
    item.isSelected = !item.isSelected;

    const selectedCategories = this.categoryList.filter(type => type.isSelected === true);
    if ( selectedCategories.length > 0) {
      this.dataservice.categoryId = selectedCategories.map(res => res.id).join(',');
    } else {
      this.dataservice.categoryId = '1,2,3,4';
    }
    this.dataservice.getFiltersByCategory();
    this.allFilterOptions = this.dataservice.filtersAllData;
    this.allVarietals = this.dataservice.allVarietals;
    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  onSelectionChange(item) {
    item.isSelected = !item.isSelected;

    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  onPageChange(pageNo) {
    this.page = pageNo;
    this.getFilteredProducts();
  }
  onCountrySelectionChange(country: Country) {
    country.isSelected = !country.isSelected;
    this.getRegions();
    /* if (country.isSelected) {
      this.allRegions = [...this.allRegions, ...country.regions];
    } else {
      country.regions.forEach(region => {
        const rindex = this.allRegions.indexOf(region);
        if (rindex !== -1) {
          this.allRegions.splice(rindex, 1);
        }
      });
    }

    this.getAllSelectedFilters();
    this.getFilteredProducts(); */
  }

  onTypeSelectionChange(type: ProductType) {
    type.isSelected = !type.isSelected;
    this.getVarietals();

    /* if (type.isSelected) {
     this.allVarietals = [...this.allVarietals, ...type.varietals];
   } else {
     type.varietals.forEach(varietal => {
       const rindex = this.allVarietals.indexOf(varietal);
       if (rindex !== -1) {
         this.allVarietals.splice(rindex, 1);
       }
     });
   }

   this.getAllSelectedFilters();
   this.getFilteredProducts();*/
  }

  getVarietals() {
    this.allVarietals = [];
    this.allFilterOptions.type.filter(type => type.isSelected === true).forEach(item => {
      this.allVarietals = [...this.allVarietals, ...item.varietals];
    });

    if (this.allFilterOptions.type.filter(type => type.isSelected === true).length === 0) {
      this.getAllVarietals();
    }

    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }
  getAllVarietals() {
    if (this.allFilterOptions && this.allFilterOptions.type) {
      this.allVarietals = this.allFilterOptions.type.reduce((acc, item) => [...acc, ...item.varietals], []);
    }
  }

  getRegions() {
    this.allRegions = [];
    this.allFilterOptions.countries.filter(country => country.isSelected === true).forEach(item => {
      this.allRegions = [...this.allRegions, ...item.regions];
    });

    if (this.allFilterOptions.countries.filter(country => country.isSelected === true).length === 0) {
      this.getAllRegions();
    }

    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  getAllRegions() {
    if (this.allFilterOptions && this.allFilterOptions.countries) {
      this.allRegions = this.allFilterOptions.countries.reduce((acc, item) => [...acc, ...item.regions], []);
    }
  }

  getSelectedFilterOptions(filterType): any[] {
    if (filterType) {
      return filterType.filter(type => type.isSelected === true);
    } else {
      return [];
    }
  }

  removeFilter(filter) {

    const index = this.selectedFilters.findIndex(item => item === filter);
    if (index !== -1) {
      this.selectedFilters.splice(index, 1);

      if (filter.id === '001') {
        this.dataservice.searchByText = '';
        this.getAllSelectedFilters();
        this.getFilteredProducts();
        return;
      }
    }

    const cindex = this.categoryList.findIndex(item => item.value === filter.value);
    if (cindex !== -1) {
        this.categoryList[cindex].isSelected = false;
        this.getAllSelectedFilters();
        this.getFilteredProducts();
        return;
    }

    const tindex = this.allFilterOptions.type.findIndex(item => item.value === filter.value);
    if (tindex !== -1) {
      this.allFilterOptions.type[tindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
      return;
    }

    const sindex = this.allFilterOptions.size.findIndex(item => item.value === filter.value);
    if (sindex !== -1) {
      this.allFilterOptions.size[sindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
      return;
    }

    const pindex = this.allFilterOptions.price.findIndex(item => item.value === filter.value);
    if (pindex !== -1) {
      this.allFilterOptions.price[pindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
    }

    const vindex = this.allVarietals.findIndex(item => item.value === filter.value);
    if (vindex !== -1) {
      this.allVarietals[vindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
    }

  }
  onPageSizeChange() {
    this.getFilteredProducts();
  }

  /* getFeatureProducts() {
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          isFeatured: this.dataservice.isFeatureProduct, pageSize: this.selectedPageSize
        }
      )));
  } */

  getProductsByKeyword() {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          categoryId: this.dataservice.categoryId, pageSize: this.selectedPageSize, keyWord: this.dataservice.searchByText
        }
      )));
  }
  getFilteredProducts() {

    let categories = '';
    let types = '';
    let varietals = '';
    let sizes = '';
    let countries = '';
    let regions = '';
    let minPrice = 0;
    let maxPrice = 0;

    if (this.selectedCategories && this.selectedCategories.length > 0) {
      categories = this.selectedCategories.map((res: Item) => res.id).join(',');
    } else {
      categories = '1,2,3,4';
    }

    if (this.selectedTypes && this.selectedTypes.length > 0) {
      types = this.selectedTypes.map((res: Item) => res.id).join(',');
    }

    if (this.selectedVarietals && this.selectedVarietals.length > 0) {
      varietals = this.selectedVarietals.map((res: Item) => res.id).join(',');
    }

    if (this.selectedSizes && this.selectedSizes.length > 0) {
      sizes = this.selectedSizes.map((res: Item) => res.id).join(',');
    }
    if (this.selectedPrices && this.selectedPrices.length > 0) {
      const prices = this.selectedPrices.map((res: Item) => res.value);

      if (prices[0].match(/\d+/g)) {
        minPrice = prices[0].match(/\d+/g).map(Number)[0];
      }

      if (prices[prices.length - 1].match(/\d+/g) && prices[prices.length - 1].match(/\d+/g).length > 1) {
        maxPrice = prices[prices.length - 1].match(/\d+/g).map(Number)[1];
      } else {
        maxPrice = 99999;
      }
    }

    if (this.selectedCountries && this.selectedCountries.length > 0) {
      countries = this.selectedCountries.map((res: Item) => res.id).join(',');
    }

    if (this.selectedRegions && this.selectedRegions.length > 0) {
      regions = this.selectedRegions.map((res: Item) => res.id).join(',');
    }
    // this.spinnerService.show();
    this.progressBarService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          categoryId: categories, pageNumber: this.page, pageSize: this.selectedPageSize, typeId: types,
          sizeId: sizes, countryId: countries, regionId: regions, varietalId: varietals,
          minPrice: minPrice, maxPrice: maxPrice, keyWord: this.dataservice.searchByText
        }
      )));
  }

  clearSearch() {
    this.categoryList.map(type => type.isSelected = false);
    this.allFilterOptions.type.map(type => type.isSelected = false);
    this.allFilterOptions.size.map(size => size.isSelected = false);
    this.allFilterOptions.price.map(price => price.isSelected = false);
    this.allVarietals.map(varietal => varietal.isSelected = false);
    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

 /*  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  } */
}

