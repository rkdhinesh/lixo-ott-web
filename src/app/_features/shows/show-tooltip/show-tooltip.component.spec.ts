import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTooltipComponent } from './show-tooltip.component';

describe('ShowTooltipComponent', () => {
  let component: ShowTooltipComponent;
  let fixture: ComponentFixture<ShowTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
