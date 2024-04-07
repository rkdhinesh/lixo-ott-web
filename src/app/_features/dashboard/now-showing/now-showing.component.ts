import { Component, OnInit, ViewChild, TemplateRef, Input } from "@angular/core";
import { ShowService } from "../service/show.service";
import { Booking } from "../../../_shared/booking/ model/booking";
import { Router } from "@angular/router";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { User } from 'src/app/_shared/user/model/user';
import { ModalService } from 'src/app/_core/service/modal.service';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Subject } from 'rxjs';


@Component({
  selector: "mp-now-showing",
  templateUrl: "./now-showing.component.html",
  styleUrls: ["./now-showing.component.scss"],
})
export class NowShowingComponent implements OnInit {
  nowShowingMovies: any;
  fetchPreference: any;
  preferredGenre: any;
  nowshowing: any;
  city: string;
  user: User;
  isLoading = false;
  loading: boolean = true;
  imageLoader = true;
  @ViewChild('selectFormat') selectFormat: TemplateRef<any>;
  @Input() public eventgenreFilters: Subject<any>;
  upcomingScroll: any;
  modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: ' modal-dialog-centered ',
  };

  constructor(public showService: ShowService, private router: Router,
    private storeService: StoreService, public userService: UserService, private modalService: ModalService,
    private bookingService: BookingService) { }

  ngOnInit(): void {
    this.city = this.storeService.get(
      'moviepanda.location', StoreType.LOCAL);
    this.userService.getUser().subscribe((users) => {

      this.user = users[0];
    });
    this.bookingService.delete();

    this.getMovies();
    this.eventgenreFilters.subscribe(response => {
      this.nowShowingMovies = response;

    })

    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 1000);
  }

  async getMovies() {

    await this.showService.getNowShowingMovies(this.city);

    this.showService.shows.subscribe((res) => {
      if ("error" != res) {
        this.nowShowingMovies = res;
        console.log(this.nowShowingMovies);
        this.loading = false;
        if (undefined != this.user && this.user.isLoggedIn === true) {
          this.getGenre();
        }
      }

    });


  }


  onMovieSelect(movie: any) {
    const booking = {} as Booking;
    Object.assign(booking, movie);
    booking.city = this.city;
    console.log(booking);
    this.showService.setBooking(booking);
    if (movie.groupId > 0 && movie.movieChoice.length > 1) {
      this.modalService.show(this.selectFormat, this.modalConfig);
    }
    else {
      this.router.navigate(["/movie-detail"]);
    }
  }


  //TODO Need to review
  getGenre() {
    let _fetchPreference = [];
    let _defaultGenre = [];
    let uniqueGenrename: string[] = [];

    this.fetchPreference = this.storeService.get('moviepanda.fetchPreferenceGenre', StoreType.LOCAL);
    if (this.fetchPreference != null || this.fetchPreference != undefined) {
      let pre_genre = JSON.parse(this.fetchPreference);
      for (let obj of pre_genre) {
        let genre = obj.genres;
        for (let elem of genre) {
          if (uniqueGenrename.indexOf(elem["genreName"]) < 0)
            uniqueGenrename.push(elem.genreName);
        }
      }

      this.nowShowingMovies.forEach((obj) => {
        for (let genre1 of obj.genres) {
          uniqueGenrename.indexOf(genre1.genreName) >= 0
            ? _fetchPreference.push(obj)
            : _defaultGenre.push(obj);
        }
      });

      let _PreferredGenreMovies = Array.from(new Set(_fetchPreference));
      let _defaultGenreMovies = Array.from(new Set(_defaultGenre));
      _defaultGenreMovies = _defaultGenreMovies.filter(
        (val) => !_PreferredGenreMovies.includes(val)
      );

      this.preferredGenre = [..._PreferredGenreMovies, ..._defaultGenreMovies];
    }
    else {
      this.preferredGenre = this.nowShowingMovies;
    }
    this.nowShowingMovies = this.preferredGenre;

  }

}

