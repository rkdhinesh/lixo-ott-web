import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { RequestHeader } from "src/app/_core/model/request-header";
import { map } from "rxjs/operators";
import { ShowDate } from "../model/show-date";
import { DatePipe } from "@angular/common";
import { Venue } from "../model/venue";
import { ShowService } from "../../dashboard/service/show.service";
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';

@Injectable({
  providedIn: "root",
})
export class ShowTimeService {
  movieShowDates = new Subject();
  venueShowDates = new Subject();
  venues = new Subject<Venue[]>();
  movies = new Subject();
  movieFileContent = new ReplaySubject(1);
  venueFileContent = new ReplaySubject(1);
  legends = new ReplaySubject(1);
  venueFileId: number;
  movieFileId: number;
  movieVenueShowFileId: number;
  venueShowTimeFileId: number;
  isErrorMovieShowDate = false;
  isErrorVenueShowDate = false;
  isErrorMovieShowTime = false;
  isErrorVenueShowTime = false;
  booking:Booking;
 
  public activeElement: string = "nodate";
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    private datePipe: DatePipe,
    public showService: ShowService,
    private bookingService: BookingService
  ) { 
    this.bookingService.get().subscribe(booking=> this.booking=booking);
  }

  async getMovieShowDates(movieId: number, city: string) {
    this.restService
      .post(EndpointsConfig.movie.showdate, {
        movie_id: movieId,
        city: city,
        header: new RequestHeader(),
      })
      .pipe(
        map((response) => {
          if (response.status.statusCode === "5001") {
            if(undefined != response.showDate ){
                response.showDate.map((showDate) => {
                    this.formatShowDate(new ShowDate(showDate));
                })
               return response;
            }else{
              this.isErrorMovieShowDate = true;
            }
          } else {
            this.isErrorMovieShowDate = true;
            this.logService.error("getMovieShowDates failed response code " +
              response.status.statusCode +"description" + response.status.statusDescription
            );
          }
        })
        ).subscribe({
          next:(response) => { 
            this.movieShowDates.next(response.showDate)
          },
          error: (err) =>{
            this.isErrorMovieShowDate = true;
            this.logService.error("~Showtimeservice~getMovieShowDates~fetech error" + err);
          }
        });
  }

  async getVenueShowDates(venueId: number, city: string) {
    this.restService
      .post(EndpointsConfig.venue.showdate, {
        venue_id: venueId,
        city: city,
        header: new RequestHeader(),
      })
      .pipe(
        map((response) => {
          if (response.status.statusCode === "6001") {
            if(undefined != response.showDate){
                response.showDate.map((showDate) => {
                   this.formatShowDate(new ShowDate(showDate));
                })
                return response;
             }else{
                this.isErrorVenueShowDate = true;
             }
          } else {
            this.isErrorVenueShowDate = true;
            this.logService.error("getVenueShowDates failed response code " +
              response.status.statusCode +"description" +response.status.statusDescription
            );
          }
        })
      ).subscribe({
          next: (response) => { 
                  if(undefined != response){
                      this.isErrorVenueShowDate = false;
                      this.isErrorVenueShowTime = false;
                      this.venueShowDates.next(response.showDate);
                  }else{
                    this.venueShowDates.next("error"); 
                    this.isErrorVenueShowDate = true;
                    this.isErrorVenueShowTime = true;
                  }
                  
            },
          error: (err) => {
            this.isErrorVenueShowDate = true;
            this.logService.error("~Showtimeservice~getVenueShowDates~fetech error" + err);
          }
      });
  }

  private formatShowDate(show: ShowDate): ShowDate {
    
    const today = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    const tomorrow = this.datePipe.transform(new Date().getDate()+1, "dd-MMM-yyyy");
    const showDay = this.datePipe.transform(show.showDate, "dd-MMM-yyyy")

    if (showDay === today) {
      show.day = "TODAY";
    } else if (showDay === tomorrow) {
      show.day = "TOM";
    }
    return show;
  }

  getMovieShowTime(movieId: number, city: string, showDate: string) {
    this.restService
      .post(EndpointsConfig.movie.showtime, {
        movie_id: movieId,
        city: city,
        showDate: showDate,
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            if(undefined != response){
            this.venues.next(response.movie.venues);
              this.booking={...this.booking,
                movieShowTermsFileId:response.movie.movieShowTermsFileId,
                movieShowTermsFlag:response.movie.movieShowTermsFlag,
               boxOfficeOnlyFlag:response.movie.boxOfficeOnlyFlag}
                this.movieFileId = this.booking.movieShowTermsFileId;
              this.bookingService.update(this.booking,);

          }
              else{
                this.isErrorMovieShowTime = true;
             }
          } else if (response.status.statusCode === "3004") {
            this.venues.next(undefined);
          } else {
            this.isErrorMovieShowTime = true;
            this.logService.error(
              "venues failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorMovieShowTime = true;
          this.logService.error("venues fetech error" + err);
        },
      });
  }

  getMovieTerms() {
    this.restService
      .get(EndpointsConfig.movie.fileidcontent + this.movieFileId)
      .subscribe({
        next: (response) => {
          this.movieFileContent.next(response);
          console.log(response);
          this.logService.info(
            "~Show Time Component~~show MovieTerms  File Idsuccessfully"
          );
        },
      });
  }

  getVenueTerms() {
    // this.showService.booking.subscribe(booking=> {
    //   this.venueFileId = booking.venueShowTermsFileId;
    // });
    this.venueFileId=this.booking.venueShowTermsFileId;
    this.restService
      .get(EndpointsConfig.movie.fileidcontent + this.venueFileId)
      .subscribe({
        next: (response) => {
          this.venueFileContent.next(response);
          console.log(response);
          this.logService.info(
            "~Show Time Component~showVenueTerms~showVenueTerms  File Idsuccessfully"
          );
        },
      });
  }

  getVenueShowTime(venueId: number, city: string, showDate: string) {
    this.restService
      .post(EndpointsConfig.venue.showtime, {
        venue_id: venueId,
        city: city,
        showDate: showDate,
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "3001") {
            if(undefined !=response.venue.movies){
            this.movies.next(response.venue.movies);
            this.booking= {...this.booking, venueShowTermsFlag: response.venue.venueShowTermsFlag};
            this.booking= {...this.booking, venueShowTermsFileId: response.venue.venueShowTermsFileId};
            this.venueShowTimeFileId = this.booking.venueShowTermsFileId;
            this.bookingService.update(this.booking);
          }else{
            this.isErrorVenueShowTime = true;
            this.movies.error("error");
          }

          } else {
            this.isErrorVenueShowTime = true;
            this.logService.error(
              "getVenueShowTime failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorVenueShowTime = true;
          this.logService.error("getVenueShowTime fetech error" + err);
        },
      });
  }
  fetchLegends() {
    this.restService
      .post(EndpointsConfig.movie.fetchlegends,{ header: new RequestHeader()})
      .subscribe({
        next: (response) => {
            this.legends.next(response);
          this.logService.info(
            "~Show Time Component~~fetch legends successfully"
          );
        },
      });
  }

}
