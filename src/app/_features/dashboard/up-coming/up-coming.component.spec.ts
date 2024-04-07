import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UpComingComponent } from "./up-coming.component";

describe("UpComingComponent", () => {
  let component: UpComingComponent;
  let fixture: ComponentFixture<UpComingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpComingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpComingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
