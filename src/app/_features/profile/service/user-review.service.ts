import { Injectable, } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { Review } from "../model/review";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { ReplaySubject } from "rxjs";
import { RequestHeader } from "src/app/_core/model/request-header";

@Injectable({
  providedIn: "root",
})
export class UserReviewService {

  userreview = new ReplaySubject(1);
  isErrorFetchingUserReview = false;
  constructor(
    private restService: RestApiService,
    private logService: LogService,
  ) { }


  addUserReview(review: Review) {
    review.header = new RequestHeader();
    this.restService
      .post(EndpointsConfig.moviedetails.adduserreview, review)
      .subscribe({
        next: (response) => {
          this.logService.info(response.status.statusCode);
          if (response.status.statusCode === "1001") {
            this.logService.info("~User review Comment added successfully ");
            this.userreview.next(response);
          } else if (response.status.statusCode === "1002") {
            this.isErrorFetchingUserReview = true;

            this.logService.info(
              "~MovieComponent~User review Comment  fails get method " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingUserReview = true;
          this.logService.info(
            "~MovieComponent~User review Comment  fails get method " + err
          );
        },
      });
  }
}
