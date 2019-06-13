import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPickupComponent } from './checkout-pickup.component';

describe('CheckoutPickupComponent', () => {
  let component: CheckoutPickupComponent;
  let fixture: ComponentFixture<CheckoutPickupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutPickupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
