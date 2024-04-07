import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SeatCountComponent } from "./seat-count.component";

describe("SeatcountComponent", () => {
  let component: SeatCountComponent;
  let fixture: ComponentFixture<SeatCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeatCountComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
