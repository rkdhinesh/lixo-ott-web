import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VenueShowTimeComponent } from "./venue-show-time.component";
import { ShowTimeService } from "../service/show-time.service";
import { DatePipe } from "@angular/common";
import { ShowService } from "../../dashboard/service/show.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { Router } from "@angular/router";

fdescribe("VenueShowTimeComponent", () => {
  let component: VenueShowTimeComponent;
  let showTimeService: ShowTimeService;
  let datePipe: DatePipe;
  let showService: ShowService;
  let modalservice: ModalService;
  let router: Router;
  beforeEach(() => {
    component = new VenueShowTimeComponent(
      showTimeService,
      datePipe,
      showService,
      modalservice,
      router
    );
  });
  it("should create VenueShowTimeComponent", () => {
    expect(component).toBeInstanceOf(VenueShowTimeComponent);
  });
});
