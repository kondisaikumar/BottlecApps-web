import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStoreComponent } from './multi-store.component';

describe('MultiStoreComponent', () => {
  let component: MultiStoreComponent;
  let fixture: ComponentFixture<MultiStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
