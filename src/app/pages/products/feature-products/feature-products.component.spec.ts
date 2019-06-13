import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureProductsComponent } from './feature-products.component';

describe('FeatureproductComponent', () => {
  let component: FeatureProductsComponent;
  let fixture: ComponentFixture<FeatureProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
