import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductGetDetails } from '../../../state/product-store/product-store.action';
import { ProductGetDetailsRequestPayload } from '../../../models/product-get-details-request-payload';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { ProductFilters } from '../../../models/product-filters';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productDetails: any;
  userReviews: any;
  qty: number;
  allFilters: ProductFilters;
  productsList: any;
  pageNumber = 0;
  varietalId = '';
  typeId = '';
  reviewAdded = false;
  isEdit = false;
  review: any;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  rating = 0;
  moreReviews: any;


  constructor(private route: ActivatedRoute,
    private store: Store<ProductGetDetailsRequestPayload>,
    private productStoreService: ProductStoreService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private cartService: CartService,
    private toastr: ToastrService,
    public dataservice: DataService,
    private progressBarService: ProgressBarService) {

    this.store.select(ProductStoreSelectors.productGetDetailsData)
      .subscribe(pgdd => {

        if (!pgdd) {
          return;
        }
        this.productDetails = pgdd;

        if (pgdd) {
          this.userReviews = [...pgdd.ListReview];

          if (pgdd && pgdd.UserReview && pgdd.UserReview.ReviewId !== 0) {
            this.userReviews = [...this.userReviews, ...pgdd.UserReview];
          }

          /* if (pgdd.ReviewTotalCount > 2) {
            this.getMoreReviews();
          } */
        }

        if (this.productDetails.Product  && this.productDetails.Product.InCart > 0) {
          this.qty = this.productDetails.Product.InCart;
        }
        if (this.productDetails.RatingAverage) {
          this.rating = +this.productDetails.RatingAverage;
        }
        this.getRelatedProducts();
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });

    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        if (pgld) {
          this.productsList = pgld ? pgld.ListProduct : [];
          this.progressBarService.hide();
        }
      });
  }

  ngOnInit() {
    this.qty = 1;
    this.rating = 0;
    this.productDetails = null;
    this.productsList = [];
    this.getProductDetails();
  }

  getProductDetails() {
    // this.spinnerService.show();
    this.progressBarService.show();
    const productId = +this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.store.dispatch(new ProductGetDetails(this.productStoreService.getProductGetDetailsParams(productId)));
    }
  }

  getMoreReviews() {
    if (this.moreReviews) {
      return;
    }

    if (this.productDetails.ReviewTotalCount <= 2) {
      return;
    }

    this.progressBarService.show();
      this.productStoreService.getReviewList(this.productDetails.Product.PID, 1).subscribe(
        (data: any) => {
          this.progressBarService.hide();
          this.moreReviews = data.ListReview;
          this.userReviews = [...data.ListReview];
        });
  }

  onEdit(review: any) {
    this.isEdit = true;
    this.review = review;
  }
  onAddReview() {
    this.reviewAdded = true;
    this.getProductDetails();
  }
  onUpdateReview() {
    this.isEdit = false;
    this.getProductDetails();
  }
  onRated(rating: number) {
    // console.log(rating);
  }

  getRelatedProducts() {

    this.getMenuFilters();
    if ((this.productDetails.CategoryId === 3 || this.productDetails.CategoryId === 1) && this.productDetails.Varietal !== '') {
      this.varietalId = this.getVarietalId(this.productDetails.Varietal);
    } else {
      this.typeId = this.getTypeId(this.productDetails.Type);
    }

    this.getProductList();
  }

  getProductList() {
    this.progressBarService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          categoryId: this.productDetails.CategoryId, varietalId: this.varietalId,
          typeId: this.typeId, pageSize: 4, pageNumber: ++this.pageNumber
        })));
  }

  addToCart() {
    if (this.productDetails && this.productDetails.Product &&
      this.productDetails.Product.PID && this.qty) {
      this.progressBarService.show();
      this.cartService.addToCard(this.productDetails.Product.PID, this.qty).subscribe(
        (data: any) => {
          this.toastr.success(data.SuccessMessage);
          this.progressBarService.hide();
          this.getProductDetails();
        });
    }

  }

  removeFromCart() {
    if (this.productDetails && this.productDetails.Product &&
      this.productDetails.Product.PID) {

      this.progressBarService.show();
      this.cartService.removeFromCart(this.productDetails.Product).subscribe(
        (data: any) => {
          this.progressBarService.hide();
          this.toastr.success(data.SuccessMessage);
          this.qty = 1;
          this.getProductDetails();
        });
    }
  }

  getTypeId(typeName: string) {
    if (this.allFilters && this.allFilters.type) {
      const type = this.allFilters.type.filter(item => item.value === typeName)[0];
      if (type) {
        return type.id;
      }
      return '';
    }
  }

  getVarietalId(varietalName: string) {
    if (this.allFilters && this.allFilters.type) {
      const varietal = this.allFilters.type.reduce((acc, item) => [...acc, ...item.varietals], [])
        .filter(varietalItem => varietalItem.value === varietalName)[0];
      // const varietal = this.allFilters.type.filter(item => item.value === varietalName)[0];
      if (varietal) {
        return varietal.id;
      }
      return 0;
    }
  }

  getMenuFilters() {
    this.dataservice.categoryId = this.productDetails.CategoryId;
    this.dataservice.getFiltersByCategory();
    this.allFilters = this.dataservice.filtersAllData;
  }

  favoriteProductUpdate(status: boolean) {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.productStoreService.favoriteProductUpdate(this.productDetails.Product.PID, status).subscribe(
      (data: any) => {
        this.productDetails.Product.IsFavorite = data.IsFavorite;
        // this.spinnerService.hide();
        this.progressBarService.hide();
        this.toastr.success(data.SuccessMessage);
      });
  }

  getQty (item: any) {
    if (item && item.DealId !== 0 && item.IsBottleLimitAtRetail === false && item.DealInventory > 0) {
      return this.quantity.filter(qty => qty <= item.DealInventory);
    }
    return this.quantity;
  }
}
