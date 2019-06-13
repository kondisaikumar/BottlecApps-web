import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterComponent } from './advance-filter.component';

describe('AdvanceFilterComponent', () => {
  let component: AdvanceFilterComponent;
  let fixture: ComponentFixture<AdvanceFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
