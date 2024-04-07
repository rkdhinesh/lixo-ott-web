import { Injectable } from "@angular/core";
import { RequestHeader } from "src/app/_core/model/request-header";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { ReplaySubject, Observable, BehaviorSubject } from "rxjs";
import { LogService } from "src/app/_core/log/log.service";
import { Store } from "@ngxs/store";
import {
  AddMovie,
  DeleteMovies,
} from "src/app/_shared/movie/store/movie-action";
import { IMovie } from "src/app/_features/shows/model/movie";
import { Movie } from "../../shows/model/movie";
import { MovieStateService } from "src/app/_shared/movie/service/movie-state.service";
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';

@Injectable({
  providedIn: "root",
})
export class ShowService {
  // booking: Booking;
  // booking= new BehaviorSubject<Booking>(new Booking());

  public movies$: Observable<IMovie[]>;

  upcoming = new ReplaySubject(1);
  isErrorNowshowingMovies = false;
  upcomingmovies: any;
  isErrorUpcomingMovies = false;
  shows = new ReplaySubject(1);
  displaymonth: any;
  upcomingmonth: Array<any> = [];
  isPurchased = new BehaviorSubject<boolean>(false)

  constructor(
    private restService: RestApiService,
    private logService: LogService,
    private store: Store,
    public movieStateService: MovieStateService,
    private bookingService: BookingService
  ) { }

  setBooking(booking: Booking) {
    this.bookingService.save(booking);
    // this.bookingService.get().subscribe( booking=> this.booking.next(booking)
    // )
  }

  async getNowShowingMovies(city: string) {
    const reqest = { city: city, header: new RequestHeader() };
    this.restService.post(EndpointsConfig.show.nowshowing, reqest).subscribe({
      next: (response) => {
        if (
          response.status.statusCode === "2001" ||
          response.status.statusCode === "1002"
        ) {
          this.isErrorNowshowingMovies = false;
          this.store.dispatch(new DeleteMovies());
          if (undefined != response.nowShowingMovies) {
            response.nowShowingMovies.forEach((movie: Movie) => {
              this.store.dispatch(new AddMovie(movie));
            });
            this.shows.next(response.nowShowingMovies);
          } else {
            this.isErrorNowshowingMovies = true;
            this.shows.next("error");
          }

        } else {
          this.isErrorNowshowingMovies = true;
          this.logService.error(
            "~ShowService~getNowhowingMovies~failed " + response.status.statusCode + "description" +
            response.status.statusDescription
          );
        }
      },
      error: (err) => {
        console.log("erro in now showing fetching::");
        this.isErrorNowshowingMovies = true;
        this.logService.error(
          "~ShowService~getNowhowingMovies~failed" +
          err
        );
      }
    });
  }


  // Get Upcoming Movies
  async getUpcomingMovies() {
    this.restService
      .post(EndpointsConfig.show.upcoming, {
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            if (undefined != response) {
              response.upcomingMovies.forEach((movie) => {
                movie.movies.forEach((movieses: Movie) => {
                  this.store.dispatch(new AddMovie(movieses));
                });
              });
              this.upcoming.next(response);
              this.upcomingmovies =response.upcomingMovies.length;
              for (let movies of response.upcomingMovies) {
                this.displaymonth = movies.month.split(" ");
                this.upcomingmonth.push(this.displaymonth);
              }
            } else {
              this.isErrorUpcomingMovies = true;
              this.shows.next("error");
            }
          } else {
            this.isErrorUpcomingMovies = true;
            this.logService.error(
              "~UpComingComponent~getUpcomingMovies~getUpcomingMovies failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorUpcomingMovies = true;
          this.logService.error(
            "~UpComingComponent~getUpcomingMovies~getUpcomingMovies fetech error" +
            err
          );
        },
      });
  }
  emailSubscribe(email_id: string) {
    this.restService
      .post(EndpointsConfig.subscribtion.subscribe, {
        email_id: email_id
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            console.log(response);
          } else {
            this.logService.info(
              "~ReservationService~bookingSummaryReserveAndBlock::booking summary failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.logService.info(
            "~ReservationService~bookingSummaryReserveAndBlock::booking summary failes post method" +
            err
          );
        },
      });
  }

}

