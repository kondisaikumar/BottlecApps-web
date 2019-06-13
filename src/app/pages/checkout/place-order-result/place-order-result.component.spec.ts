import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOrderResultComponent } from './place-order-result.component';

describe('PlaceOrderResultComponent', () => {
  let component: PlaceOrderResultComponent;
  let fixture: ComponentFixture<PlaceOrderResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceOrderResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOrderResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
