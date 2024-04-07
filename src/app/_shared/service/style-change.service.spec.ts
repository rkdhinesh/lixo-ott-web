import { TestBed } from "@angular/core/testing";

import { StyleChangeService } from "./style-change.service";

describe("StyleChangeService", () => {
  let service: StyleChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleChangeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
