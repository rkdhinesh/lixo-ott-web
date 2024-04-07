import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalService } from "src/app/_core/service/modal.service";
import { ShowTimeService } from "../service/show-time.service";
import { ShowService } from "../../dashboard/service/show.service";
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';

@Component({
  selector: "mp-movie-shows-terms",
  templateUrl: "./movie-shows-terms.component.html",
  styleUrls: ["./movie-shows-terms.component.scss"],
})
export class MovieShowsTermsComponent implements OnInit {
  venueTerm: string;
  @ViewChild("selectSeatCount") selectSeatCountModal: TemplateRef<any>;
  @ViewChild("movieShowTerm") movieShowTerm: TemplateRef<any>;
  @ViewChild("venueTerm") venueShowTerm: TemplateRef<any>;
  booking:Booking;
  constructor(
    private modalService: ModalService,
    public showService: ShowService,
    public showTimeService: ShowTimeService,
    private bookingService: BookingService
  ) { 
    this.bookingService.get().subscribe(booking=>this.booking=booking);
  }

  ngOnInit(): void {
    this.booking = {...this.booking,selectedmovieterm:false};
    this.bookingService.update(this.booking);
  }

  movieTermsHide() {
    this.modalService.hide();
    this.bookingService.update(this.booking);
    localStorage.setItem("MovieTerms", "true");

    this.booking.selectedmovieterm = false;
  }

  openSeatCountModal(openVenue: any) {
    this.modalService.hide();
    this.venueTerm = this.booking.venueShowTermsFlag;
    this.booking.selectedvenueterm = true;
    if (this.venueTerm === "Y" && openVenue === "venue") {
      this.showVenueFileId();
    } else {
      this.modalService.show(this.selectSeatCountModal);
    }
    this.bookingService.update(this.booking);
  }
  showVenueFileId() {
    this.showTimeService.getVenueTerms();
    localStorage.setItem("MovieTerms", "false");
    this.modalService.show(this.venueShowTerm);
  }
}
