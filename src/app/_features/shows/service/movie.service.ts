import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RequestHeader } from "src/app/_core/model/request-header";
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { StoreService } from 'src/app/_core/state/store.service';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddMovie } from "src/app/_shared/movie/store/movie-action";
import { IMovie } from '../model/movie';



@Injectable({
  providedIn: "root",
})
export class MovieService {
  isErrorFetchingMovieDeatils = false;
  isErrorFetchingCastAndCrew = false;
  subscription: Subscription = new Subscription();

  movie = new Subject();
  isErroraddVenues = false;
  isErrorDeleteVenue = false;
  selectedVenue: Array<any> = [];
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    private storeService: StoreService,
    private store: Store
  ) { }

  async getMovie(movieid: number) {
    await this.restService
      .post(EndpointsConfig.moviedetails.movietrailer, {
        movieId: movieid,
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            if (undefined != response.movies) {
              this.movie.next(response.movies);
            } else {
              this.isErrorFetchingMovieDeatils = true;
              this.movie.error("error");
            }
          } else {
            this.isErrorFetchingMovieDeatils = true;
            this.logService.error(
              "~MovieNameComponent~getMovieDetails~movie retrival failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingMovieDeatils = true;
          this.logService.error(
            "~MovieNameComponent~getMovieDetails~movie retrival failed response code " +
            err
          );
        },
      });
  }
// get-movie-details -- refactored endpoint

async getMovieDetails(movieid: number) {
  await this.restService
    .get(EndpointsConfig.moviedetails.movieinfo+movieid)
    .subscribe({
      next: (response) => {
        if (undefined != response.movieId || null != response.movieId) {
          this.movie.next(response);
        } else {
          this.isErrorFetchingMovieDeatils = true;
          this.logService.error(
            "~MovieNameComponent~getMovieDetails~movie retrival failed response code " +
            response.status +
            "description" +
            response.message
          );
        }
      },
      error: (err) => {
        this.isErrorFetchingMovieDeatils = true;
        this.logService.error(
          "~MovieNameComponent~getMovieDetails~movie retrival failed response code " +
          err
        );
      },
    });
}


  //TODO Need to review
  deletePreferredVenue(favourite: any, venueId: number) {
    let venue = this.storeService.get(
      'deletepreference',
      StoreType.LOCAL
    );
    const request = {
      venueId: venueId,
      userVenuePreferenceId: JSON.parse(venue),
      header: new RequestHeader(),
    };

    this.restService
      .post(EndpointsConfig.preference.deletevenue, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            if (
              this.selectedVenue.indexOf(
                favourite + venueId
              ) >= 0
            ) {
              this.selectedVenue.splice(
                this.selectedVenue.indexOf(
                  "favourite" + venueId
                ),
                1
              );
            }

          } else {
            this.isErrorDeleteVenue = true;
            this.logService.error(
              "~EditProfileComponent~deletePreferredVenue~deletePreferredVenue failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorDeleteVenue = true;
          this.logService.error(
            "~EditProfileComponent~deletePreferredVenue~deletePreferredVenue fetech error" +
            err
          );
        },
      });
  }


  // preference venues
  addPreferredVenue(venueId: number) {
    const request = {
      // tslint:disable-next-line: object-literal-shorthand
      venueId: venueId,
      header: new RequestHeader(),
    };
    this.restService
      .post(EndpointsConfig.preference.addvenue, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.logService.info(
              "~EditProfileComponent~addPreferedVenue~addPreferedVenue successfully"
            );
            this.selectedVenue.push(
              "favourite" + venueId
            );

          } else {
            this.isErroraddVenues = true;
            this.logService.error(
              "~EditProfileComponent~addPreferredVenue~addPreferredVenue failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErroraddVenues = true;
          this.logService.error(
            "~EditProfileComponent~addPreferredVenue~addPreferredVenue fetech error" +
            err
          );
        },
      });
  }


  addMovieToStore(iMovie: IMovie) {
    this.store.dispatch(new AddMovie(iMovie));
  }


}