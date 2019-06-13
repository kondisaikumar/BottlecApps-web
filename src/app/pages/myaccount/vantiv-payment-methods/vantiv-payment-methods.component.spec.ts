import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VantivPaymentMethodsComponent } from './vantiv-payment-methods.component';

describe('VantivPaymentMethodsComponent', () => {
  let component: VantivPaymentMethodsComponent;
  let fixture: ComponentFixture<VantivPaymentMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VantivPaymentMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VantivPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
