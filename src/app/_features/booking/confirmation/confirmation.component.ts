import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReservationService } from "../service/reservation.service";
import { ShowService } from "../../dashboard/service/show.service";
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Movie } from "../../shows/model/movie";
import { Booking } from "src/app/_shared/booking/ model/booking";
import { MovieStateService } from "src/app/_shared/movie/service/movie-state.service";
import { BookingService } from "src/app/_shared/booking/service/booking.service";
import { MovieService } from "../../shows/service/movie.service";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";

@Component({
  selector: "mp-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"],
})
export class ConfirmationComponent implements OnInit {
  bookingId: string;
  bookingReferenceId: string;
  language: string;
  movieId: any;
  city: any;
  movie: Movie;
  Timeduration: any;
  venueId: any;
  MovieGenreName: any;
  LocalityName: any;
  booking: Booking;
  @ViewChild("myFormPost") myFormPost: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public reservationService: ReservationService,
    public showService: ShowService,
    private translate: TranslateService,
    private storeService: StoreService,
    private bookingService: BookingService,
    public movieService: MovieService,
    public movieStateService: MovieStateService,
    private restService: RestApiService
  ) {
    this.bookingService.get().subscribe((booking) => (this.booking = booking));
  }
  timer: boolean;
  settimer: boolean;
  timeLeft: string = '30';
  interval;
  ngOnInit(): void {
    this.language = this.storeService.get(
      'moviepanda.language',
      StoreType.LOCAL
    );

    if (!this.language) {
      this.translate.setDefaultLang("English");
    }
    else {
      this.translate.setDefaultLang(this.language);
    }
    // tslint:disable-next-line: no-string-literal
    this.bookingId = this.route.snapshot.queryParams["bookingId"];
    this.bookingReferenceId = this.route.snapshot.queryParams[
      // tslint:disable-next-line: no-string-literal
      "bookingReferenceId"
    ];

    this.reservationService.getTicketDetails(this.bookingId, this.bookingReferenceId);
    ({ movieId: this.movieId, city: this.city, venueId: this.venueId } = this.booking);
    this.movieId = this.booking.movieId;
    this.venueId = this.booking.venueId;

    this.movieStateService.getMovie(this.movieId).subscribe((movie) => {
      if (null != movie[0] && undefined != movie[0]) {
        this.movie = movie[0];
        this.Timeduration = this.movie.duration;
        this.movie.genres.forEach(erg => {
          this.MovieGenreName = erg.genreName;
        })
      }
    });
    this.getVenueById();

  }
  //  if click browser back navigate to home page

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log("Back button pressed" + event);
    this.router.navigate(['/']);
  }
  resendNotification() {
    this.reservationService.resendNotification(this.bookingId);
    this.timer = false;
    this.settimer = true;
  }
  /// timer settime in login otp screen
  startTimer() {
    this.interval = setInterval(() => {
      var timeLeft = parseInt(this.timeLeft);
      if (timeLeft > 0) {
        timeLeft--;
        this.timeLeft = String(timeLeft);
        if (timeLeft < 10) {
          this.timeLeft = '0' + timeLeft;
        }

      } else {
        timeLeft = 30;
        this.timeLeft = String(timeLeft);
        clearInterval(this.interval);
        this.timer = false;
        this.settimer = false;
      }
    }, 1000);
  }
  getVenueById() {
    this.venueId = this.booking.venueId;
    this.restService
      .get(EndpointsConfig.getvenuebyid.byvenue + this.venueId)
      .subscribe({
        next: (response) => {
          this.LocalityName = response.locality.localityName
        }
      })
  }
}
