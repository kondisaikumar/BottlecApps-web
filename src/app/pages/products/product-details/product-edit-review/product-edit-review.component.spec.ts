import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditReviewComponent } from './product-edit-review.component';

describe('ProductEditReviewComponent', () => {
  let component: ProductEditReviewComponent;
  let fixture: ComponentFixture<ProductEditReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
