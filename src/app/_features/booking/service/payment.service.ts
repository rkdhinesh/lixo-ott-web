import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { Subject } from "rxjs";
import { Order } from "../model/order";
import { RequestHeader } from "src/app/_core/model/request-header";
import { PaymentRequest } from "../model/payment-request";
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Razorpayresponse } from '../model/razorpayresponse';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Router } from '@angular/router';
import { SeatBlockingRequest } from '../model/seat-blocking-request';
import { UnblockSeatStatus } from "../model/unblock-seat-status";
import { User } from "src/app/_shared/user/model/user";
import { UserService } from "src/app/_shared/user/service/user.service";
import { TokenStorage } from "src/app/_core/guard/token-storage";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  razorPayment = new Subject<any>();
  payment = new Subject<Order>();
  wallet = new Subject();
  fareDetils = new Subject();
  unBlockStatus = new Subject();
  blockStatus = true;
  paymentModes = new Subject();
  isErrorFetchingPayment = false;
  isErrorFetchingMakeWalletPayment = false;
  booking: Booking;
  isErrorFares = false;
  isSeatBlock = false;
  user: User;
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    private storeService: StoreService,
    private router: Router,
    private bookingService: BookingService,
    public userService: UserService,
    private auth: TokenStorage,
  ) {
    this.bookingService.get().subscribe(booking => this.booking = booking);
  }

  connectRazorPay(payment) {
    const paymentReqeust = new PaymentRequest();
    Object.assign(paymentReqeust, this.booking);
    Object.assign(paymentReqeust, payment);
    paymentReqeust.header = new RequestHeader();
    paymentReqeust.showDetailsId = this.booking.showPublishedId;
    paymentReqeust.bookingId = this.storeService.get("bookingId", StoreType.LOCAL)
    this.bookingService.update(this.booking);
    this.restService
      .post(EndpointsConfig.booking.razorPayPayment, paymentReqeust)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.payment.next(response.razorpayPaymentDetail);
            this.storeService.put(
              'orderId', response.razorpayPaymentDetail.orderId,
              StoreType.LOCAL
            );
            this.storeService.put(
              'razorpayOrderId', response.razorpayPaymentDetail.razorpayOrderId,
              StoreType.LOCAL
            );
            this.storeService.put(
              'orderAmount', response.razorpayPaymentDetail.orderAmount,
              StoreType.LOCAL
            );
          } else {
            this.logService.info(
              "~ReservationService~seatingRepresentation::seat layout failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingPayment = true;
          this.logService.error(
            "~PaymentComponent~getPaymentDetail~payment fetech error" + err
          );
        },
      });
  }
  connectCashFree(payment) {

    const paymentReqeust = new PaymentRequest();

    Object.assign(paymentReqeust, this.booking);
    Object.assign(paymentReqeust, payment);
    paymentReqeust.header = new RequestHeader();
    paymentReqeust.showDetailsId = this.booking.showPublishedId;

    this.restService

      .post(EndpointsConfig.booking.cashFreePayment, paymentReqeust)

      .subscribe({

        next: (response) => {

          if (response.status.statusCode === "1001") {

            this.payment.next(response.paymentDetails);

          } else {

            this.logService.info(

              "~ReservationService~seatingRepresentation::seat layout failes post method" +

              response.status.statusCode +

              "description" +

              response.status.statusDescription

            );

          }

        },

        error: (err) => {

          this.isErrorFetchingPayment = true;

          this.logService.error(

            "~PaymentComponent~getPaymentDetail~payment fetech error" + err

          );

        },

      });

  }

  getRazorpayPaymentDetail() {
    const paymentRazorpayReqeust = new Razorpayresponse();

    paymentRazorpayReqeust.orderId = this.storeService.get("orderId", StoreType.LOCAL);
    paymentRazorpayReqeust.razorpayOrderId = this.storeService.get("razorpay_order_id", StoreType.LOCAL);
    paymentRazorpayReqeust.amount = this.storeService.get("orderAmount", StoreType.LOCAL);
    paymentRazorpayReqeust.referenceId = this.storeService.get("razorpay_payment_id", StoreType.LOCAL);
    paymentRazorpayReqeust.signature = this.storeService.get("razorpay_signature", StoreType.LOCAL);



    this.restService
      .post(EndpointsConfig.booking.paymentRazorpay, paymentRazorpayReqeust)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001" || response.status.statusCode === "1002") {
            this.razorPayment.next(response);
          }
          else if (response.status.statusCode === "1005") {
            this.razorPayment.next(response);
            this.router.navigate[('/')]
          }
          else {
            this.logService.info(
              "~ReservationService~seatingRepresentation::seat layout failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.logService.error(
            "~PaymentComponent~getPaymentDetail~payment fetech error" + err
          );
        },
      });
  }

  makeWalletPayment() {
    const order = new Order();
    Object.assign(this.booking, order);
    this.bookingService.update(this.booking);
    this.restService
      .post(EndpointsConfig.bookingseatservice.walletpayment, order)
      .subscribe({
        next: (response) => {
          if (
            response.status.statusCode === "1001" ||
            response.status.statusCode === "1003"
          ) {
            this.wallet.next(response);
          } else if (
            response.status.statusCode === "1004" ||
            response.status.statusCode === "1005"
          ) {
            this.wallet.next(response);
          } else {
            this.isErrorFetchingMakeWalletPayment = true;
            this.logService.error(
              "~PaymentComponent~makeWalletPayment~payment retrival failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingMakeWalletPayment = true;
          this.logService.error(
            "~PaymentComponent~makeWalletPayment~payment retrival failed response code " +
            err
          );
        },
      });
  }
  paymentMode() {
    this.restService.get(EndpointsConfig.booking.paymentMode).subscribe({
      next: (response) => {
        this.paymentModes.next(response);
      },
    });
  }

  getFareDetail() {
    const seatblocking = new SeatBlockingRequest();
    seatblocking.header = new RequestHeader();
    Object.assign(seatblocking, this.booking);
    seatblocking.showDetailsId = this.booking.showPublishedId;
    seatblocking.systemId = "moviepanda";

    const authToken = this.auth?.getToken();
    if (authToken != null || authToken != undefined) {
      var token = authToken
      var decoded: any = jwt_decode(token);
      seatblocking.companyId = decoded.companyId;
    }
    this.restService
      .post(EndpointsConfig.booking.seatblock, seatblocking)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.blockStatus = true;
            if (undefined != response) {
              this.isErrorFares = false;
              this.fareDetils.next(response);
              this.storeService.put("bookingId", response.bookingId, StoreType.LOCAL);
            } else {
              this.isErrorFares = true;
              this.fareDetils.error("error");
            }
          } else {
            this.blockStatus = false;
            console.log("Seat Already Blocked");
            this.isErrorFares = true;
            this.logService.info(
              "~ReservationService~bookingSummaryReserveAndBlock::booking summary failes post method" +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.blockStatus = false;
          this.isErrorFares = true;
          this.logService.info(
            "~ReservationService~bookingSummaryReserveAndBlock::booking summary failes post method" +
            err
          );
        },
      });
  }

  seatUnblockingStatus() {
    const unBlockSeat = new UnblockSeatStatus();
    unBlockSeat.header = new RequestHeader();
    unBlockSeat.venueId = this.booking.venueId;
    unBlockSeat.seat_layout = this.booking.seatLayout;
    this.userService.getUser().subscribe((users) => {
      this.user = users[0];
    });
    unBlockSeat.userId = this.user.userId;
    this.restService.post(EndpointsConfig.booking.unblockseatstatus, unBlockSeat)
      .subscribe({
        next: (response) => {
          this.unBlockStatus.next(response);
          if (response.status.statusCode === "1001") {

            this.logService.info("Ticket status updated successfully"
            );
          }
          else {
            this.isSeatBlock = true;
            this.logService.info("Ticket status updated Failed");
          }
        },
        error: (err) => {
          this.isSeatBlock = true;
          this.logService.error(
            "~SummryComponent~unSeatBookingStatus~update error" +
            err
          );
        },
      });
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/booking']);
  }

}
