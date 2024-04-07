import { TestBed } from "@angular/core/testing";

import { RecommendedMoviesService } from "./recommended-movies.service";

describe("RecommendedMoviesService", () => {
  let service: RecommendedMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendedMoviesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
