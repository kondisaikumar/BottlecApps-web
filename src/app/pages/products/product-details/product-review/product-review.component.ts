import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../../../services/customer.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  @Input() review: any;
  @Output() edit = new EventEmitter<any>();

  currentUserId: number;
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    if (this.customerService.customerSession) {
      this.currentUserId = this.customerService.customerSession.UserId;
    }
  }

  getCount(n: number): any[] {
    return Array(n);
  }
  onEdit() {
    this.edit.emit(this.review);
  }

}
