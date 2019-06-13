import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { VantivPaymentServerSideApiService } from '../../../services/vantiv-payment-serverside-api.service';

@Component({
  selector: 'app-place-order-result',
  templateUrl: './place-order-result.component.html',
  styleUrls: ['./place-order-result.component.scss']
})
export class PlaceOrderResultComponent implements OnInit {
  @Input() orderNumber: string;
  constructor(private router: Router,
    private commonService: CommonService,
    private vantivPaymentService: VantivPaymentServerSideApiService) { }

  ngOnInit() {
    this.commonService.onOrderPlaced(false);
    this.vantivPaymentService.vUserSelectedPaymentAccountID = '';
  }

  onContinueShoping() {
    this.router.navigate(['/home']);
  }

}
