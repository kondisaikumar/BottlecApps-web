import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductStoreService } from '../../../../services/product-store.service';
import { FormControl, FormGroup } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../auth.service';
import { Router } from '@angular/router';
import { ProgressBarService } from '../../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-product-edit-review',
  templateUrl: './product-edit-review.component.html',
  styleUrls: ['./product-edit-review.component.scss']
})
export class ProductEditReviewComponent implements OnInit {
  @Input() productId: number;
  @Input() review: any;
  @Input() edit: boolean;
  @Output() updateReview = new EventEmitter<any>();

  formAddProductReview: FormGroup;
  rating = 0;

  constructor(private productService: ProductStoreService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.formAddProductReview = new FormGroup({
      rTitle: new FormControl(this.review.ReviewTitle),
      rDescription: new FormControl(this.review.ReviewDescription)
    });
    if (this.review) {
      this.rating = +this.review.ReviewRating;
    }
  }

  onRated(rating) {
    this.rating = rating;
  }

  onUpdateReview() {

    if (this.authService.getUserId() === '0') {
      this.router.navigate(['/login']);
      return;
    }

    if (this.rating === 0) {
      this.toastr.error('Please Add Rating');
      return;
    }

    // this.spinnerService.show();
    this.progressBarService.show();
    const title = this.formAddProductReview.get('rTitle').value;
    const description = this.formAddProductReview.get('rDescription').value;
    const reviewId = this.review.ReviewId;

    this.productService.updateProductReview(this.productId, title, description, this.rating, reviewId).subscribe(
      (data: any) => {
        // this.toastr.success(data.SuccessMessage);
        this.updateReview.emit();
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
  }
}
