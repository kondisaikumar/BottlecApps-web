import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadappComponent } from './downloadapp.component';

describe('DownloadappComponent', () => {
  let component: DownloadappComponent;
  let fixture: ComponentFixture<DownloadappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
