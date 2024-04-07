import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { StoreService } from 'src/app/_core/state/store.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { ShowService } from '../service/show.service';

@Component({
  selector: 'mp-up-coming',
  templateUrl: './up-coming.component.html',
  styleUrls: ['./up-coming.component.scss'],
})
export class UpComingComponent implements OnInit {
  @ViewChild('monthScroll') movieScroll: ElementRef<any>;
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow:
      '<span class="slick-prev  position-absolute"><img class="mw-100" src="./assets/images/img/slider-left.svg"></span>',
    nextArrow:
      '<span class="slick-next  position-absolute"><img class="mw-100" src="./assets/images/img/slider-right.svg"></span>',
    autoplay: false,
  };
  activemonth: string;
  loading: boolean = true;
  imageLoader = true;
  displayMonth = [];
  constructor(public showService: ShowService, private storeService: StoreService, private router: Router,
    private route: ActivatedRoute) { }
  upcoming: any;
  city: string;
  bookflag: boolean = false;
  showmore: boolean;
  showless = true;
  selectedIndex = 1;
  fragment: any;
  ngOnInit(): void {
    this.city = this.storeService.get('moviepanda.location', StoreType.LOCAL);
    this.getUpComingMovie();
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }
  async getUpComingMovie() {
    await this.showService.getUpcomingMovies();
    this.showService.upcoming.subscribe((res) => {
      if ("error" != res) {
        this.upcoming = res;
        this.loading = false;
        this.activemonth = this.upcoming.upcomingMovies[0]?.month;
        if (Object.keys(this.upcoming.upcomingMovies).length == 0 || Object.keys(this.upcoming.upcomingMovies).length == 1) {
          this.showless = false;
          this.showmore = false;
        } else if (Object.keys(this.upcoming.upcomingMovies).length > this.selectedIndex) {
          this.showmore = true;
          this.showless = false;
        } else {
          this.showmore = false;
          this.showless = true;
        }
      }
    });
  }
  ngAfterViewChecked(): void {
    try {
      if (this.fragment) {
        document.querySelector('#' + this.fragment).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        this.route.queryParams.subscribe(c => {
          const params = Object.assign({}, c);
          delete params.dapp;
          this.router.navigate([], { relativeTo: this.route, queryParams: params });
        }).unsubscribe();
      }
    } catch (e) { }
  }


  onMovieSelect(movie: any) {
    const booking = {} as Booking;
    Object.assign(booking, movie);
    booking.city = this.city;
    this.showService.setBooking(booking);
    this.storeService.put('btnflag', this.bookflag, StoreType.LOCAL);
    this.router.navigate(['/movie']);

  }
  onselectmonth(month) {
    if (month !== undefined && month !== '' && month !== null) {
      this.activemonth = month;
    }
    //remove--once scroll down default its scolling 
    this.route.queryParams.subscribe(c => {
      const params = Object.assign({}, c);
      delete params.dapp;
      this.router.navigate([], { relativeTo: this.route, queryParams: params });
    }).unsubscribe();
  }



  showMoreDetails() {
    let movieindex = this.upcoming.upcomingMovies;
    this.selectedIndex = Object.keys(movieindex).length;
    this.showmore = false;
    this.showless = true;

  }
  showLessDetails() {
    this.selectedIndex = 1;
    this.showmore = true;
    this.showless = false;

  }
}
