import { Injectable } from "@angular/core";
import { RequestHeader } from "src/app/_core/model/request-header";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { Subject } from "rxjs";
import { LogService } from "src/app/_core/log/log.service";
import { ShowService } from "../../dashboard/service/show.service";
import { SeatLayout } from "../model/seat-layout";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  seatlayout = new Subject<SeatLayout>();
  blockedSeates = new Subject();
  resendNotify = new Subject();
  isErroFetchingSeatLayout = false;
  isErroFetchingBlockSeats = false;
  ticket = new Subject();
  isErrorBooking = false;
  isErrorSeats = false;
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    public showService: ShowService,
    private storeService: StoreService
  ) { }

  async seatingRepresentation(showDetailsId: number, location: string) {
    const seatRequest = {
      // tslint:disable-next-line: object-literal-shorthand
      showDetailsId: showDetailsId,
      // tslint:disable-next-line: object-literal-shorthand
      location: location,
      header: new RequestHeader(),
    };

    this.restService
      .post(EndpointsConfig.booking.seatlayout, seatRequest)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            if (undefined != response.seat_layout) {
              this.seatlayout.next(response.seat_layout);
            } else {
              this.isErroFetchingSeatLayout = true;
              this.seatlayout.error("error");
            }
          } else {
            this.isErroFetchingSeatLayout = true;
            this.logService.info(
              "~ReservationService~seatingRepresentation::seat layout failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErroFetchingSeatLayout = true;
          this.logService.error(
            "~ReservationService`~SeatLayoutComponent~seatingRepresentation~locaiton fetech error" +
            err
          );
        },
      });
  }
  getTicketDetails(bookingId: string, bookingReferenceId: string) {
    const ticketDetailsRequest = {
      // tslint:disable-next-line: object-literal-shorthand
      bookingId: bookingId,
      // tslint:disable-next-line: object-literal-shorthand
      bookingReferenceId: bookingReferenceId,
      location: this.storeService.get(
        'moviepanda.location', StoreType.LOCAL),
      header: new RequestHeader(),
    };
    this.restService
      .post(EndpointsConfig.booking.getticketdetails, ticketDetailsRequest)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            if (undefined != response) {
              this.ticket.next(response);
            } else {
              this.isErrorBooking = true;
              this.ticket.error("error");
            }
          } else {
            this.isErrorBooking = true;
            this.logService.info(
              "~ReservationService~getTicket::tiket gets failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorBooking = true;
          this.logService.error(
            "~PaymentComponent~getPaymentDetail~payment fetech error" + err
          );
        },
      });
  }





  resendNotification(notificationObject) {
    const resendNotificationRequest = {
      bookingId: notificationObject,
      location: this.storeService.get(
        'moviepanda.location', StoreType.LOCAL),
      header: new RequestHeader(),

    };
    this.restService.post(EndpointsConfig.booking.resendnotification, resendNotificationRequest)

      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.resendNotify.next(response);

          } else {

            this.logService.info(
              "~ReservationService~resndnotification::notification failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {

          this.logService.error(
            "~ReservationService`~SeatLayoutComponent~seatingRepresentation~locaiton fetech error" +
            err
          );
        },
      });

  }

}
