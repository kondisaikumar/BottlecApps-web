import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPaymentMethodComponent } from './checkout-payment-method.component';

describe('CheckoutPaymentMethodComponent', () => {
  let component: CheckoutPaymentMethodComponent;
  let fixture: ComponentFixture<CheckoutPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
