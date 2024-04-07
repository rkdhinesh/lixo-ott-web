import { Injectable } from "@angular/core";
import { Order } from "../model/order";
import { RequestHeader } from "src/app/_core/model/request-header";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  notification = new ReplaySubject(1);
  isErrorFetchingResndNotification = false;

  constructor(
    private restService: RestApiService,
    private logService: LogService
  ) {}

  resendTicket(order: Order) {
    order.header = new RequestHeader();
    this.restService
      .post(EndpointsConfig.booking.resendnotification, order)
      .subscribe({
        next: (response) => {
          this.logService.info(response.status.statusCode);
          if (response.status.statusCode === "1001") {
            this.notification.next(response);
          } else {
            this.isErrorFetchingResndNotification = true;
            this.logService.info(
              "~ticketconfirmation~resendnotify movie retrival failed" +
                response.status.statusCode +
                "description" +
                response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingResndNotification = true;
          this.logService.error(
            "~ticketconfirmationcomponent~resendTicket~notification fetech error" +
              err
          );
        },
      });
  }
}
