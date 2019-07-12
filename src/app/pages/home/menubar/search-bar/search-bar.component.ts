import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataFilterAllService } from '../../../../services/data-filter-all.service';
import { Router } from '@angular/router';
import { ProductStoreService } from '../../../../services/product-store.service';
import { CustomerLoginSession } from '../../../../models/customer-login-session';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  customerSession: CustomerLoginSession;
  searchText: string;
  hitsArray: any;
  PreSearchResults = [];
  imagePath: any;
  size: any;
  name: any;
  routePath: string;
  constructor(public dataservice: DataFilterAllService, private router: Router, private productStoreService: ProductStoreService) { }

  ngOnInit() { }
  saveSearch() {
    this.productStoreService.elaticsearchText = this.searchText;
    this.productStoreService.getelastiSearch().subscribe(data => {
      this.PreSearchResults = [];
      if (data && data.hits.hits.length > 0) {
        this.hitsArray = data.hits.hits;
        for (let i = 0; i < this.hitsArray.length; i++) {
          const fieldArray = this.hitsArray[i].fields.sproduct[0];
          if (fieldArray.spname === '') {
            this.name = this.hitsArray[i]._source.pname;
          } else {
            this.name = fieldArray.spname;
          }
          if (fieldArray.spsize === '') {
            this.size = this.hitsArray[i]._source.psize;
          } else {
            this.size = fieldArray.spsize;
          }
          if (fieldArray.spimage === '') {
            this.imagePath = this.hitsArray[i]._source.pimage;
          } else {
            this.imagePath = fieldArray.spimage;
          }
          this.PreSearchResults.push(Object.assign({
            storeId: fieldArray.storeid,
            name: this.name,
            size: this.size,
            imagePath: this.imagePath,
            pPrice: fieldArray.spprice,
            spid: fieldArray.spid,
            sprice: fieldArray.spsprice,
            spdesc: fieldArray.spdesc,
            productid: fieldArray.productid,
            category: this.hitsArray[i]._source.pcat,
            region: this.hitsArray[i]._source.pregion,
            type: this.hitsArray[i]._source.ptype,
            varietal: this.hitsArray[i]._source.pvarietal,
            upc: this.hitsArray[i]._source.pupc,
            country: this.hitsArray[i]._source.pcountry
          }));
        }
      }
      // hits completed
      if (data && data.hits.hits.length === 0) {
        for (let i = 0; i < data.suggest.productsuggestfuzzy[0].options.length; i++) {
          if (data.suggest.productsuggestfuzzy[0].options[i].fields === undefined) {
            this.PreSearchResults.push(Object.assign({
              storeId: 0,
              name: data.suggest.productsuggestfuzzy[0].options[i]._source.pname,
              size: data.suggest.productsuggestfuzzy[0].options[i]._source.psize,
              imagePath: data.suggest.productsuggestfuzzy[0].options[i]._source.pimage,
              pPrice: 0,
              spid: 0,
              sprice: 0,
              spdesc: '',
              productid: 0,
              category: data.suggest.productsuggestfuzzy[0].options[i]._source.pcat,
              region: data.suggest.productsuggestfuzzy[0].options[i]._source.pregion,
              type: data.suggest.productsuggestfuzzy[0].options[i]._source.ptype,
              varietal: data.suggest.productsuggestfuzzy[0].options[i]._source.pvarietal,
              upc: data.suggest.productsuggestfuzzy[0].options[i]._source.pupc,
              country: data.suggest.productsuggestfuzzy[0].options[i]._source.pcountry
            }));
          }
          if (data.suggest.productsuggestfuzzy[0].options[i].fields !== undefined) {
            // tslint:disable-next-line:max-line-length
            for (let k = 0; k < data.suggest.productsuggestfuzzy[0].options[i].fields.sproduct.length; k++) {
              if (data.suggest.productsuggestfuzzy[0].options[i].fields.sproduct[k].storeid === localStorage.getItem('storeId')) {
                const fieldArray = data.suggest.productsuggestfuzzy[0].options[i].fields.sproduct[k];
                if (fieldArray.spname === '') {
                  this.name = data.suggest.productsuggestfuzzy[0].options[i]._source.pname;
                } else {
                  this.name = fieldArray.spname;
                }
                if (fieldArray.spsize === '') {
                  this.size = data.suggest.productsuggestfuzzy[0].options[i]._source.psize;
                } else {
                  this.size = fieldArray.spsize;
                }
                if (fieldArray.spimage === '') {
                  this.imagePath = data.suggest.productsuggestfuzzy[0].options[i]._source.pimage;
                } else {
                  this.imagePath = fieldArray.spimage;
                }
                this.PreSearchResults.push(Object.assign({
                  storeId: fieldArray.storeid,
                  name: this.name,
                  size: this.size,
                  imagePath: this.imagePath,
                  pPrice: fieldArray.spprice,
                  spid: fieldArray.spid,
                  sprice: fieldArray.spsprice,
                  spdesc: fieldArray.spdesc,
                  productid: fieldArray.productid,
                  category: data.suggest.productsuggestfuzzy[0].options[i]._source.pcat,
                  region: data.suggest.productsuggestfuzzy[0].options[i]._source.pregion,
                  type: data.suggest.productsuggestfuzzy[0].options[i]._source.ptype,
                  varietal: data.suggest.productsuggestfuzzy[0].options[i]._source.pvarietal,
                  upc: data.suggest.productsuggestfuzzy[0].options[i]._source.pupc,
                  country: data.suggest.productsuggestfuzzy[0].options[i]._source.pcountry
                }));
                break;
                // tslint:disable-next-line:max-line-length
              } else if (data.suggest.productsuggestfuzzy[0].options[i].fields.sproduct[k].storeid !== localStorage.getItem('storeId') && k === data.suggest.productsuggestfuzzy[0].options[i].fields.sproduct.length - 1) {
                this.PreSearchResults.push(Object.assign({
                  storeId: 0,
                  name: data.suggest.productsuggestfuzzy[0].options[i]._source.pname,
                  size: data.suggest.productsuggestfuzzy[0].options[i]._source.psize,
                  imagePath: data.suggest.productsuggestfuzzy[0].options[i]._source.pimage,
                  pPrice: 0,
                  spid: 0,
                  sprice: 0,
                  spdesc: '',
                  productid: 0,
                  category: data.suggest.productsuggestfuzzy[0].options[i]._source.pcat,
                  region: data.suggest.productsuggestfuzzy[0].options[i]._source.pregion,
                  type: data.suggest.productsuggestfuzzy[0].options[i]._source.ptype,
                  varietal: data.suggest.productsuggestfuzzy[0].options[i]._source.pvarietal,
                  upc: data.suggest.productsuggestfuzzy[0].options[i]._source.pupc,
                  country: data.suggest.productsuggestfuzzy[0].options[i]._source.pcountry
                }));
              }
            }
          }
        }
      }
      console.log(this.PreSearchResults);
    });
  }
  searchByText() {
    this.dataservice.searchByText = this.searchText;
    this.dataservice.categoryId = '1,2,3,4';
    this.router.navigate(['/advance-filter']);
    this.searchText = '';
  }
  productRoute(spid) {
    if (spid !== 0) {
      this.routePath = '/product-details/' + spid;
      this.router.navigate([this.routePath]);
    }
    // routerLink="/product-details/{{result.spid}}"
  }
}
