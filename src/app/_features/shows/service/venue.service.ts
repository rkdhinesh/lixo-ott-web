import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { RequestHeader } from "src/app/_core/model/request-header";
import { EndpointsConfig } from "src/app/_config/endpoints.config";

@Injectable({
  providedIn: "root",
})
export class VenueService {
  venuescity = new ReplaySubject(1);
  venueExperiences = new ReplaySubject();

  isErrorVenuebyCity = false;
  isErrorExperiencebyVenue = false;

  constructor(private restService: RestApiService, private logService: LogService) { }


  getVenuebyCity(city: string) {
    const request = { city: city, header: new RequestHeader() };
    this.restService
      .post(EndpointsConfig.venue.bycity, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            if(undefined != response.venues){
            this.venuescity.next(response.venues);
            }else{
              this.isErrorVenuebyCity=true;
              this.venuescity.error("error");
            }
          } else {
            this.isErrorVenuebyCity = true;
            this.logService.error(
              "getVenuebyCity failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorVenuebyCity = true;
          this.logService.error(
            "getVenuebyCity fetech error" + err
          );
        },
      });
  }

  getExperiencebyVenue(venueId: number) {
    // tslint:disable-next-line: object-literal-shorthand
    const request = { venueId: venueId, header: new RequestHeader() };
    this.restService
      .post(EndpointsConfig.venue.experiencebyvenue, request)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.isErrorExperiencebyVenue = true;
            this.venueExperiences.next(response.experiences);
          } else {

            this.logService.error(
              "getExperiencebyVenue failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {

          this.logService.error(
            "getExperiencebyVenue fetech error" + err
          );
        },
      });

  }
}
