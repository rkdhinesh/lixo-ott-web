import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RequestHeader } from "src/app/_core/model/request-header";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RecommendedMoviesService {
  recommandedMovie = new ReplaySubject(1);
  isErrorFetchingRecommandedMovie = false;
  constructor(
    private restService: RestApiService,
    private logService: LogService
  ) { }
  getRecommendedMovies(movieid: number, city: string) {
    this.restService
      .post(EndpointsConfig.moviedetails.getrecommended, {
        movie_id: movieid,
        // tslint:disable-next-line: object-literal-shorthand
        city: city,
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {

            this.recommandedMovie.next(response.nowShowingMovies);
          } else {
            this.isErrorFetchingRecommandedMovie = true;
            this.logService.error(
              "~MovieComponent~RecommandedMovie~ retrival failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingRecommandedMovie = true;
          this.logService.error(
            "~MovieComponent~RecommandedMovie~ retrival failed response code " +
            err
          );
        },
      });
  }
}
