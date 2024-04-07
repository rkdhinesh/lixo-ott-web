import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPurchaseComponent } from './rental-purchase.component';

describe('RentalPurchaseComponent', () => {
  let component: RentalPurchaseComponent;
  let fixture: ComponentFixture<RentalPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
