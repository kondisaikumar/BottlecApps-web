import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddReviewComponent } from './product-add-review.component';

describe('ProductAddReviewComponent', () => {
  let component: ProductAddReviewComponent;
  let fixture: ComponentFixture<ProductAddReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
