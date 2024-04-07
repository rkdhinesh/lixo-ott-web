import { TestBed } from "@angular/core/testing";

import { VenueService } from "./venue.service";

describe("VenuesService", () => {
  let service: VenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
