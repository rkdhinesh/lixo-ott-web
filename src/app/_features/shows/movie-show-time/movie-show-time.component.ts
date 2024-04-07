import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, PipeTransform, Pipe } from '@angular/core';
import { ShowTimeService } from '../service/show-time.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { ShowService } from '../../dashboard/service/show.service';
import { first } from 'rxjs/operators';
import { MovieService } from '../service/movie.service';
import { MovieStateService } from 'src/app/_shared/movie/service/movie-state.service';
import { Subscription } from 'rxjs';
import { Movie } from '../model/movie';
import { User } from 'src/app/_shared/user/model/user';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PreferenceService } from '../../profile/service/preference.service';
import { Venue } from '../model/venue';
import { DomSanitizer } from '@angular/platform-browser';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Router } from '@angular/router';


@Component({
  selector: 'mp-movie-show-time',
  templateUrl: './movie-show-time.component.html',
  styleUrls: ['./movie-show-time.component.scss'],
})
export class MovieShowTimeComponent implements OnInit, OnDestroy {
  movie: Movie;
  largePoster: string = '';
  seatCount: number;
  userComment: boolean;
  movieId: number;
  city: string;
  classes: any;
  showDate: string;
  showAllDates: any;
  fetchVenuePreference;
  movieTerm: string;
  user: User;
  profilename: string;
  isLoggedIn: boolean = false;
  modalRef: BsModalRef;
  public activeElement: string = 'nodate';
  selectedDate: string;
  formattedDate: string;
  selectedVenue: Array<any> = [];
  showTimeValue: Array<Venue> = [];
  preferredVenues: Array<Venue> = [];
  subscription: Subscription = new Subscription();
  loader: boolean;
  trailerUrl: any;
  legends: any;
  booking: Booking;
  boxOfficeOnlyFlag: boolean;
  @ViewChild('movieTerm') movieTerms: TemplateRef<any>;
  @ViewChild('venueTerm') venueTerms: TemplateRef<any>;
  @ViewChild('selectSeatCount') selectSeatCountModal: TemplateRef<any>;
  @ViewChild('trailerPlayer') trailerPlayer: TemplateRef<any>;
  hidediv: boolean;
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
  bookflag: boolean = true;
  constructor(
    public showsTimeService: ShowTimeService,
    private modalService: ModalService,
    public showService: ShowService,
    public movieService: MovieService,
    public movieStateService: MovieStateService,
    public userService: UserService,
    private storeService: StoreService,
    private bookingService: BookingService,
    public preference: PreferenceService,
    public moviesService: MovieService,
    public sanitizer: DomSanitizer,
    public router: Router
  ) {
    this.bookingService.get().subscribe((booking) => (this.booking = booking));
  }

  ngOnInit(): void {
    this.loader = true;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.booking = { ...this.booking, selectedvenueterm: true, selectedmovieterm: true };
    this.storeService.delete('count', StoreType.LOCAL);
    ({ movieId: this.movieId, city: this.city } = this.booking);
    console.log(this.movieId);
    console.log(this.city);
    this.movieId = this.booking.movieId;
    this.city = this.booking.city;
    console.log(this.movieId);
    console.log(this.city);
    this.getShowDates(this.movieId, this.city);
    let movieStateSub = this.movieStateService.getMovie(this.movieId).subscribe((movie) => {
      if (null != movie[0] && undefined != movie[0]) {
        this.movie = movie[0];
        console.log(this.movie);
        if (this.movie.posterUrl.indexOf('~') != -1) {
          this.largePoster = this.movie.posterUrl.slice(
            this.movie.posterUrl.indexOf('~') + 1,
            this.movie.posterUrl.length
          );
        }
      }
    });
    this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
    this.subscription.add(movieStateSub);
    this.showsTimeService.fetchLegends();
    this.showsTimeService.legends.subscribe(res => this.legends = res);
  }

  async getShowDates(movieId: number, city: string) {
    await this.showsTimeService.getMovieShowDates(movieId, city);
    if (this.booking.showDate === undefined) {
      this.showsTimeService.movieShowDates.pipe(first()).subscribe((showDate) => {
        //this.showAllDates = showDate;
        this.getMovieShowTimes(showDate[0]?.showDate);
      });
    } else {
      this.getMovieShowTimes(this.booking.showDate);
    }
  }

  async getMovieShowTimes(showDate: string) {
    this.loader = true;
    let sub1 = await this.showsTimeService.getMovieShowTime(this.movieId, this.city, showDate);
    this.booking = { ...this.booking, showDate: showDate };
    let sub2 = await this.showsTimeService.venues.subscribe((res) => {
      if (undefined != res) {
        this.showTimeValue = res;
        for (let sold of this.showTimeValue) {
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
        this.preferedVenue();
      }
    });
    this.subscription.add(sub2);
    this.subscription.add(sub1);
    if (showDate !== undefined) {
      this.activeElement = showDate;
    }
  }

  onVenueSelect(venueId: number, venueName: string, addressLine1: string, addressLine2: string) {
    this.booking = { ...this.booking, venueId: venueId };
    this.booking = { ...this.booking, venueName: venueName };
    this.booking = { ...this.booking, addressLine1: addressLine1 };
    this.booking = { ...this.booking, addressLine2: addressLine2 };
    this.booking = { ...this.booking, fromVenue: true };
    this.bookingService.update(this.booking);
    this.router.navigate(['/']);
  }

  //TODO Code review
  openUserReviewModal(userComment: TemplateRef<any>, login: TemplateRef<any>) {
    this.userService.getUser().subscribe((users) => {
      this.user = users[0];
    });
    if (this.user.isLoggedIn === true) {
      this.userComment = true;
      this.modalService.show(userComment);
    } else {
      this.modalService.show(login);
    }
  }

  close() {
    this.modalService.hide();
  }

  showMovieDetails() {
    this.storeService.put('btnflag', this.bookflag, StoreType.LOCAL);
    this.router.navigate(['/movie']);
  }
  over(show: any) {
    this.boxOfficeOnlyFlag = show.boxOfficeOnlyFlag
    this.classes = show.classes
  }
  //TODO Code review Pending
  proceedSeatSelection(venue:any, show:any) {
    this.booking = { ...this.booking, venueId: venue.venueId };
    Object.assign(this.booking, show);
    this.booking = { ...this.booking, className: show.classes };
        this.booking.venueShowTermsFlag = venue.venueShowTermsFlag;
    this.movieTerm = this.booking.movieShowTermsFlag;
     if (this.movieTerm === 'Y' && venue.venueShowTermsFlag === 'Y') {
      if (this.booking.selectedvenueterm === true && this.booking.selectedmovieterm === true) {
        this.showMovieTerms();
      } else if (this.booking.selectedvenueterm === false && this.booking.selectedmovieterm === false) {
        this.showVenueTerms();
      } else if (this.booking.selectedmovieterm === false) {
        this.showMovieTerms();
      } else {
        this.modalService.show(this.selectSeatCountModal);
      }
    } else if (this.movieTerm === 'N' && venue.venueShowTermsFlag === 'Y') {
      if (this.booking.selectedvenueterm === true && this.booking.selectedmovieterm === true) {
        this.showVenueTerms();
      } else {
        this.modalService.show(this.selectSeatCountModal);
      }
    } else if (this.movieTerm === 'Y' && venue.venueShowTermsFlag === 'N') {
      if (this.booking.selectedmovieterm === true && this.booking.selectedvenueterm === true) {
        this.showMovieTerms();
      } else if (this.booking.selectedmovieterm === false && this.booking.selectedvenueterm === false) {
        this.modalService.show(this.selectSeatCountModal);
      } else if (this.booking.selectedmovieterm === false) {
        this.showMovieTerms();
      } else  {
        this.modalService.show(this.selectSeatCountModal);
      }    
    } else {
      this.modalService.show(this.selectSeatCountModal);
    }
    this.bookingService.update(this.booking);  
  }

  showMovieTerms() {
    this.booking.selectedmovieterm = false;
    this.showsTimeService.getMovieTerms();
    this.modalService.show(this.movieTerms);
  }
  showVenueTerms() {
    this.booking.selectedmovieterm = false;
    this.showsTimeService.getVenueTerms();
    this.modalService.show(this.venueTerms);
  }

  //TODO Code review pending
  preferedVenue() {
    let _fetchPreference = [];
    let _defaultVenue = [];
    let uniqueVenuename: string[] = [];

    this.fetchVenuePreference = this.storeService.get('moviepanda.fetchPreferenceVenue', StoreType.LOCAL);
    if (this.fetchVenuePreference != null || this.fetchVenuePreference != undefined) {
      let pre_venue = JSON.parse(this.fetchVenuePreference);
      for (let obj of pre_venue) {
        let venue = obj.venues;
        for (let elem of venue) {
          this.selectedVenue.push('favourite' + JSON.stringify(elem.venueId));
          if (uniqueVenuename.indexOf(elem['venueName']) < 0) uniqueVenuename.push(elem.venueName);
        }
      }
      this.showTimeValue.forEach((obj) =>
        uniqueVenuename.indexOf(obj['venueName']) >= 0 ? _fetchPreference.push(obj) : _defaultVenue.push(obj)
      );
      this.preferredVenues = [..._fetchPreference, ..._defaultVenue];
    } else {
      this.preferredVenues = this.showTimeValue;
    }
    this.loader = false;
  }
  showbutton(venueId: number, login: TemplateRef<any>) {
    this.userService.getUser().subscribe((users) => {
      this.user = users[0];
    });
    if (this.user.isLoggedIn === true) {
      if (this.moviesService.selectedVenue.indexOf('favourite' + venueId) < 0) {
        this.moviesService.addPreferredVenue(venueId);
      } else {
        this.moviesService.deletePreferredVenue('favourite', venueId);
      }
    } else {
      this.modalService.show(login);
    }
  }

  onClickPlay(templateName: TemplateRef<any>) {
    let config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'my-modal modal-dialog-centered modal-lg',
    };
    this.modalService.show(templateName, config);
  }

  ngOnDestroy() {
    console.log('on destroy called');
    this.subscription.unsubscribe();
    console.log('cleared all values::');
  }
}

@Pipe({ name: 'splitAndGet' })
export class SplitAndGetPipe implements PipeTransform {
  transform(input: string, separator: string, index: number): string {
    return input.split(separator)[index];
  }
}
