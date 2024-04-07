import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { ReplaySubject } from "rxjs";
import { LogService } from "src/app/_core/log/log.service";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  location = new ReplaySubject(1);
  locations = new ReplaySubject(1);
  cities: string;
  popularCities: string;
  otherCities: string;
  isErrorFetchingLocation = false;
  constructor(
    private restService: RestApiService,
    private logService: LogService
  ) { }

  getAllLocation() {
    this.restService
      .get(EndpointsConfig.location.viewlocation)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.location.next(response);
            this.popularCities = response.popularCities;
            this.otherCities = response.otherCities;
          } else {
            this.isErrorFetchingLocation = true;
            this.logService.error(
              "~LocationComponent~getlocation~locaiton retrival failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingLocation = true;
          this.logService.error(
            "~LocationComponent~getlocation~locaiton fetech error" + err
          );
        },
        complete: () => {
          this.locationConcatnate();
        },
      });
  }
  private locationConcatnate() {
    this.cities = this.popularCities.concat(
      this.otherCities
    );
    this.locations.next(this.cities);
  }

}
