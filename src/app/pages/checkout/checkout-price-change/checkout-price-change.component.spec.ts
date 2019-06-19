import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPriceChangeComponent } from './checkout-price-change.component';

describe('CheckoutPriceChangeComponent', () => {
  let component: CheckoutPriceChangeComponent;
  let fixture: ComponentFixture<CheckoutPriceChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutPriceChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPriceChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
