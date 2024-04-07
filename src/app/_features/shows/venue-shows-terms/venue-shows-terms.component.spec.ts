import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueShowsTermsComponent } from './venue-shows-terms.component';

describe('VenueShowsTermsComponent', () => {
  let component: VenueShowsTermsComponent;
  let fixture: ComponentFixture<VenueShowsTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueShowsTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueShowsTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
