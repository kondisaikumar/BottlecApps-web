import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homecaurosel',
  templateUrl: './homecaurosel.component.html',
  styleUrls: ['./homecaurosel.component.scss']
})
export class HomecauroselComponent implements OnInit {
@Input() eventList: any;
isShowFilters = false;
categoryFilters: any;

  constructor(private router: Router, public dataservice: DataService) { }

  ngOnInit() {
  }

  showFilters(categoryId) {
    this.isShowFilters = true;
    this.categoryFilters = { 'CategoryId': categoryId};
  }

  showProducts(catId, catName) {
    this.dataservice.searchByText = '';
    this.dataservice.categoryId = catId;
    this.dataservice.getFiltersByCategory();
    this.router.navigate([`/${catName}`]);
  }

  onApplyFilter() {
    this.isShowFilters = false;
  }
}
