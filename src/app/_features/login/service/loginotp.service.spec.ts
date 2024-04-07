import { TestBed } from "@angular/core/testing";

import { LoginotpService } from "./loginotp.service";

describe("LoginotpService", () => {
  let service: LoginotpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginotpService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
