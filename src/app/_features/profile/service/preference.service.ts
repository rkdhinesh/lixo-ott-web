import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { ReplaySubject, Subject } from "rxjs";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RequestHeader } from "src/app/_core/model/request-header";
import { ShowService } from "../../dashboard/service/show.service";
import { GetGenres } from "../../booking/model/genres";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';

@Injectable({
  providedIn: "root",
})
export class PreferenceService {
  genre = new ReplaySubject(1);
  venues = new ReplaySubject(1);
  fetchGenre = new ReplaySubject(1);
  addvenueResponse = new Subject();


  isErrorPreference = false;
  isErrorGetGenre = false;
  isErrorDeleteGenre = false;
  isErrorGetAll = false;
  isErroraddVenues = false;
  isErrorGetVenues = false;
  isErrorDeleteVenue = false;
  fetchResponseGenre: any;
  preferencegenresModels: Array<any>;
  preferenceAllGenreModels: Array<GetGenres>;
  userVenuePreferenceId: number;
  userCredentialId:number;
  DeletegenreResponse: any;
  deletevenue: any;
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    public showService: ShowService, private storeService: StoreService
  ) { }

  // preference
  addPreferedGenre(generId: number) {
    // tslint:disable-next-line: object-literal-shorthand
    const request = { generId: generId, header: new RequestHeader() };
    this.restService
      .post(EndpointsConfig.preference.addgenre, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.logService.info(
              "~EditProfileComponent~addPreferedGenre~addPreferedGenre successfully"
            );
          } else {
            this.isErrorPreference = true;
            this.logService.error(
              "~EditProfileComponent~addPreferedGenre~addPreferedGenre  failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorPreference = true;
          this.logService.error(
            "~EditProfileComponent~addPreferedGenre~addPreferedGenre fetech error" +
            err
          );
        },
      });
  }

  getPreferredGenre() {
    const request = { header: new RequestHeader() };
    this.restService
      .post(EndpointsConfig.preference.fetchgenre, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.fetchGenre.next(response);
            this.preferencegenresModels = response.genres;

            this.DeletegenreResponse = response.userPreferenceGenreId;
            this.storeService.put(
              'moviepanda.fetchPreferenceGenre',
              JSON.stringify(response.genres), StoreType.LOCAL
            );
            this.logService.info(
              "~EditProfileComponent~getPreferedGenre~getPreferedGenre successfully"
            );
          } else {
            this.isErrorGetGenre = true;
            this.logService.error(
              "~EditProfileComponent~getPreferredGenre~getPreferredGenre  failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorGetGenre = true;
          this.logService.error(
            "~EditProfileComponent~getPreferredGenre~getPreferredGenre fetech error" +
            err
          );
        },
        complete: () => {
          this.preferredGenre();
        },
      });
  }

  deletePreferredGenre(genreId: number) {
    const request = {
      // tslint:disable-next-line: object-literal-shorthand
      genreId: genreId,
      // tslint:disable-next-line: object-literal-shorthand
      userPreferenceGenreId: this.DeletegenreResponse,
      header: new RequestHeader(),
    };

    this.restService
      .post(EndpointsConfig.preference.deletegenre, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.logService.info(
              "~EditProfileComponent~deletePreferedGenre~deletePreferedGenre successfully"
            );
          } else {
            this.isErrorDeleteGenre = true;
            this.logService.error(
              "~EditProfileComponent~deletePreferredGenre~deletePreferredGenre failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorDeleteGenre = true;
          this.logService.error(
            "~EditProfileComponent~deletePreferredGenre~deletePreferredGenre fetech error" +
            err
          );
        },
      });
  }
  getGenres() {
    const request = { header: new RequestHeader() };

    this.restService.post(EndpointsConfig.movie.genres, request).subscribe({
      next: (response) => {
        if (response.status.statusCode === "1001") {
          this.genre.next(response);
          this.preferenceAllGenreModels = response.genres;
        } else {
          this.isErrorGetAll = true;
          this.logService.error(
            "~EditProfileComponent~getGenres~getGenres failed response code " +
            response.status.statusCode +
            "description" +
            response.status.statusDescription
          );
        }
      },
      error: (err) => {
        this.isErrorGetAll = true;
        this.logService.error(
          "~EditProfileComponent~getGenres~getGenres fetech error" + err
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
            this.addvenueResponse.next(response);
            this.logService.info(
              "~EditProfileComponent~addPreferedVenue~addPreferedVenue successfully"
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

  getPreferrdVenue() {
    const request = { header: new RequestHeader() };
    this.restService
      .post(EndpointsConfig.preference.fetchvenue, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.venues.next(response.venue);
            this.userVenuePreferenceId = response.userVenuePreferenceId;
            this.userCredentialId = response.userCredentialId;
            this.storeService.put(
              'moviepanda.fetchPreferenceVenue',
              JSON.stringify(response.venue), StoreType.LOCAL
            );
            this.storeService.put(
              'deletepreference',
              JSON.stringify(this.userVenuePreferenceId), StoreType.LOCAL
            );
          } else {
            this.isErrorGetVenues = true;
            this.logService.error(
              "~EditProfileComponent~getPreferrdVenue~getPreferrdVenue failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorGetVenues = true;
          this.logService.error(
            "~EditProfileComponent~getPreferrdVenuee~getPreferrdVenue fetech error" +
            err
          );
        },
      });
  }
  deletePreferredVenue(venueId: number) {
    const request = {
      // tslint:disable-next-line: object-literal-shorthand
      venueId: venueId,
      userVenuePreferenceId: this.userVenuePreferenceId,
      userCredentialId : this.userCredentialId,
      header: new RequestHeader(),
    };

    this.restService
      .post(EndpointsConfig.preference.deletevenue, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.logService.info(
              "~EditProfileComponent~deletePreferedVenue~deletePreferedVenue successfully"
            );
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

  private preferredGenre() {
    for (const Genre of this.preferenceAllGenreModels) {
      // get all genre
      for (const perfer of this.preferencegenresModels) {
        // user prefered genre
        for (const perferGenre of perfer.genres) {
          if (Genre.genreId === perferGenre.genreId) {
            Genre.selectedGenre = true;
          } else if (
            Genre.genreId !== perferGenre.genreId &&
            Genre.selectedGenre === false
          ) {
            Genre.selectedGenre = false;
          }
        }
      }
    }
  }
}
