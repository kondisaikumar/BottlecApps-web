import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAddressesComponent } from './manage-addresses.component';

describe('AddnewaddressComponent', () => {
  let component: ManageAddressesComponent;
  let fixture: ComponentFixture<ManageAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
