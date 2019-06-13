import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecauroselComponent } from './homecaurosel.component';

describe('HomecauroselComponent', () => {
  let component: HomecauroselComponent;
  let fixture: ComponentFixture<HomecauroselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomecauroselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomecauroselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
