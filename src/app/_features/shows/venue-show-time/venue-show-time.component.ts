import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ShowTimeService } from "../service/show-time.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { ShowService } from "../../dashboard/service/show.service";
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { VenueService } from '../service/venue.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Subject } from 'rxjs';

@Component({
  selector: "mp-venue",
  templateUrl: "./venue-show-time.component.html",
  styleUrls: ["./venue-show-time.component.scss"],
})
export class VenueShowTimeComponent implements OnInit {
  showClass: any;
  seatCount: number;
  venueId: number;
  city: string;
  venueTimeTerms: string;
  public activeElement: string = "nodate";
  selectedDate: string;
  formattedDate: string;
  venueName: string;
  venueAddress1: string;
  venueAddress2: string;
  fromPage: string = "";
  showAllDates: any;
  venueMovies: any;
  fromDashboard: any = null;
  classes: any;
  legends: any;
  @Input() public eventFromDashboard: Subject<any>;
  @ViewChild("movieTerm") movieTerms: TemplateRef<any>;
  @ViewChild("selectSeatCount") selectSeatCountModal: TemplateRef<any>;
  @ViewChild("venueTerm") venueTerms: TemplateRef<any>;
  slideConfig = {
    slidesToShow: 6,
    slidesToScroll: 1,
    prevArrow:
      '<span class="slick-prev  position-absolute"><img class="mw-100" src="./assets/images/img/slider-left.svg"></span>',
    nextArrow:
      '<span class="slick-next  position-absolute"><img class="mw-100" src="./assets/images/img/slider-right.svg"></span>',
    autoplay: false,
    infinite: false,
  };
  booking: Booking;
  loader: boolean;
  constructor(
    public showTimeService: ShowTimeService,
    public showService: ShowService,
    private modalservice: ModalService,
    private router: Router,
    private bookingService: BookingService,
    public venueService: VenueService,
    private storeService: StoreService,
    public showsTimeService: ShowTimeService,
  ) {
    this.bookingService.get().subscribe(booking => this.booking = booking);
  }

  ngOnInit(): void {
    this.loader = true;
    this.booking = { ...this.booking, selectedvenueterm: true };
    this.booking = { ...this.booking, selectedmovieterm: true };
    this.city = this.storeService.get('moviepanda.location', StoreType.LOCAL);
    this.storeService.delete('count', StoreType.LOCAL);
    this.venueService.getVenuebyCity(this.city);
    this.getShowDates();
    this.eventFromDashboard.subscribe(response => {
      this.getShowDates();
      console.log(response);
    })
    this.showsTimeService.fetchLegends();
    this.showsTimeService.legends.subscribe(res => this.legends = res);
  }


  getShowDates() {
    this.venueId = this.booking.venueId;
    this.venueName = this.booking.venueName;
    this.venueAddress1 = this.booking.addressLine1;
    this.venueAddress2 = this.booking.addressLine2;
    this.showTimeService.getVenueShowDates(this.venueId, this.city);
    this.showTimeService.venueShowDates.pipe(take(1)).subscribe((showDate) => {
      if (undefined != showDate && showDate != "error") {
        this.showAllDates = showDate;
        this.getVenueShowTime(showDate[0]?.showDate);
      }
    });
  }

  getVenueShowTime(showDate: string) {
    this.loader = true;
    this.booking = { ...this.booking, showDate };
    this.bookingService.update(this.booking);
    this.showTimeService.getVenueShowTime(this.venueId, this.city, showDate);
    this.showTimeService.movies.pipe(take(1)).subscribe((movies) => {
      this.venueMovies = movies;
      for (let sold of this.venueMovies) {

        for (let disable of sold.shows) {
          let i = 0;
          disable.classesValues = 0;
          disable.totalClassesValues = 0;
          for (let out of disable.classes) {
            disable.classesValues += out.availableSeats;
            disable.totalClassesValues += out.totalSeats;
            if (out.availableSeats > 0) {
              i = 1;
            }

          }
          if (i == 0) {
            disable.soldoutDisable = true;
          }
        }
      }
      this.loader = false;
    })
    if (showDate !== undefined) {
      if (this.activeElement === "nodate") {
        this.activeElement = showDate;
      } else if (this.activeElement !== "nodate") {
        this.activeElement = showDate;

      }
    }
  }

  onSelectMovies(movies: any) {
    Object.assign(this.booking, movies);
    this.router.navigate(["shows"]);
  }

  proceedSeatSelection(movie: any, show: any) {
    this.booking = { ...this.booking, showTime: show.showTime };
    this.booking = { ...this.booking, showPublishedId: show.showPublishedId };
    this.booking = { ...this.booking, showDate: show.showDate };
    this.booking = { ...this.booking, className: show.className };
    this.booking = { ...this.booking, showDate: show.showDate };
    this.booking = { ...this.booking, movieName: movie.movieName };
    this.booking = { ...this.booking, movieId: movie.movieId };
    this.booking = { ...this.booking, posterUrl: movie.posterUrl };
    this.booking = { ...this.booking, language: movie.language };
    this.booking = { ...this.booking, trailerUrl: movie.trailerUrl };
    this.booking = { ...this.booking, city: this.city };

    this.modalservice.show(this.selectSeatCountModal);
    this.bookingService.update(this.booking);
  }
  showMovieTerms() {
    this.booking.selectedmovieterm = true;
    this.showTimeService.getMovieTerms();
    this.modalservice.show(this.movieTerms);
  }
  showVenueTerms() {
    this.booking.selectedvenueterm = true;
    this.showTimeService.getVenueTerms();
    this.modalservice.show(this.venueTerms);
  }
  // To get BaseFare of Claasses According to the venue
  getBaseFare(showClass: any) {
    this.showClass = showClass;
    this.booking = { ...this.booking, className: showClass };
    this.bookingService.update(this.booking);
  }
  onMovieSelect(movie: any) {
    const booking = {} as Booking;
    Object.assign(booking, movie);
    booking.city = this.city;
    console.log(booking);
    this.showService.setBooking(booking);
    this.router.navigate(["/shows"]);
  }
  over(show: any) {
    this.classes = show.classes;
  }
}
