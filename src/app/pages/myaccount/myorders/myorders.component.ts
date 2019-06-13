import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  myOrdersList: any;
  page = 1;

  constructor(private ordersService: OrdersService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    // this.spinnerService.show();
    this.progressBarService.show();
    this.ordersService.getMyOrdersList(this.page).subscribe(
      (data: any) => {
        this.myOrdersList = data;
        // this.spinnerService.hide();
        this.progressBarService.hide();
      });
  }

  onOrderCancelled() {
    this.getMyOrders();
  }

  onPageChange(pageNo) {
    this.page = pageNo;
    this.getMyOrders();
  }
}
