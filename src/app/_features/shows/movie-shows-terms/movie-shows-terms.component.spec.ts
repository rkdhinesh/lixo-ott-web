import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MovieShowsTermsComponent } from "./movie-shows-terms.component";

describe("MovieShowsTermsComponent", () => {
  let component: MovieShowsTermsComponent;
  let fixture: ComponentFixture<MovieShowsTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovieShowsTermsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieShowsTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
