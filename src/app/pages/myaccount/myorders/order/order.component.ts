import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrdersService } from '../../../../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() order: any;
  @Output() canceled = new EventEmitter();
  isVisible = false;
  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.isVisible = false;
  }

  cancelOrder(orderId) {
    this.ordersService.cancelOrder(orderId).subscribe(data => {
      this.canceled.emit();
      this.toastr.success(data.SuccessMessage);
    });
  }

  reOrder(orderId) {
    this.ordersService.reOrder(orderId).subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }
}
