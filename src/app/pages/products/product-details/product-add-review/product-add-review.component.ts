import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductStoreService } from '../../../../services/product-store.service';
import { FormControl, FormGroup } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../auth.service';
import { Router } from '@angular/router';
import { ProgressBarService } from '../../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-product-add-review',
  templateUrl: './product-add-review.component.html',
  styleUrls: ['./product-add-review.component.scss']
})
export class ProductAddReviewComponent implements OnInit {
  @Input() productId: number;
  @Output() addReview = new EventEmitter<any>();

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
      rTitle: new FormControl(''),
      rDescription: new FormControl(''),
    });
  }

  onRated(rating) {
    this.rating = rating;
  }

  onAddReview() {

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

    this.productService.addProductReview(this.productId, title, description, this.rating ).subscribe(
      (data: any) => {
        // this.toastr.success(data.SuccessMessage);
        this.addReview.emit();
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
  }
}
