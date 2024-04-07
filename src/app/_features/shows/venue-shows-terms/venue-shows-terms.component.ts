import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalService } from "src/app/_core/service/modal.service";
import { ShowService } from "../../dashboard/service/show.service";
import { ShowTimeService } from "../service/show-time.service";
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';

@Component({
  selector: "mp-venue-shows-terms",
  templateUrl: "./venue-shows-terms.component.html",
  styleUrls: ["./venue-shows-terms.component.scss"],
})
export class VenueShowsTermsComponent implements OnInit {
  venueTerm: string;
  showvenue: boolean;
  show: boolean;
  @ViewChild("venueTerm") venueTerms: TemplateRef<any>;
  @ViewChild("selectSeatCount") selectSeatCountModal: TemplateRef<any>;
  @ViewChild("movieShowTerm") movieShowTerm: TemplateRef<any>;
  booking: Booking;
  constructor(
    private modalService: ModalService,
    public showService: ShowService,
    public showTimeService: ShowTimeService,
    private bookingService :BookingService
  ) {
    this.bookingService.get().subscribe(booking=>this.booking=booking);
   }

  ngOnInit(): void {
    this.booking.selectedvenueterm = false;
    this.bookingService.update(this.booking);
  }

  openSeatCountModal(openMovie: any) {
    this.modalService.hide();
    this.booking.selectedmovieterm = true;

    this.venueTerm = this.booking.venueShowTermsFlag;
    this.booking.selectedmovieterm = true;
    this.bookingService.update(this.booking);
    if (this.venueTerm === "Y" && openMovie === "movie") {
      this.modalService.show(this.selectSeatCountModal);
    }


  }

  showMovieFileId() {
    this.showTimeService.getMovieTerms();
    this.modalService.show(this.movieShowTerm);
  }
  close() {
    this.modalService.hide();
    this.booking.selectedvenueterm = false;

  }
}
