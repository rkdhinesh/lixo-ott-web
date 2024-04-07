import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { RequestHeader } from "src/app/_core/model/request-header";
import { Order } from "../../booking/model/order";
import { LogService } from "src/app/_core/log/log.service";
import { Enrollment, WalletTransaction, Kyc } from '../model/enrollment';
import { PaymentRequest } from '../../booking/model/payment-request';
import { Router } from '@angular/router';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';


@Injectable({
  providedIn: "root",
})
export class WalletService {
  walletPayment = new ReplaySubject(1);
  wallet = new ReplaySubject(1);
  walletStatus = new ReplaySubject(1);
  enrollmentResponse = new ReplaySubject(1);
  unEnrollmentResponse = new ReplaySubject(1);
  walletRechargeResponse = new ReplaySubject(1);
  walletTransaction = new ReplaySubject(1);

  isErrorFetchingWallet = false;
  isErrorFetchingConfirmWallet = false;
  enrollmentStatus: string;
  walletresponseModel: WalletTransaction[];
  kycResponse: Kyc[];
  enrollmentError: boolean;
  enrollmentRequest: Enrollment = new Enrollment();
  booking: Booking
  constructor(
    private restService: RestApiService,
    private logService: LogService,
    private router: Router,
    private bookingService:BookingService
  ) { this.bookingService.get().subscribe(booking=>this.booking=booking);}

  getWalletDetail(userId: string) {
    const order = new Order();
    Object.assign(this.booking, order);
    this.restService
      .post(EndpointsConfig.booking.getwalletdetails, {
        user_id: userId,
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.wallet.next(response);
          } else {
            this.isErrorFetchingWallet = true;
            this.logService.error(
              "~WalletComponent~getWalletDetail~wallet retrival failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.isErrorFetchingWallet = true;
          this.logService.error(
            "~WalletComponent~getwallet~wallet fetech error" + err
          );
        },
      });
  }




  getWalletStatus() {
    let headers: any = {
      'Content-Type': 'application/json',
    }
    let httpConfig = { url: EndpointsConfig.booking.walletstatus, headers: headers }
    this.restService.getWithHeaders(httpConfig)
      .subscribe({
        next: (response) => {

          this.walletStatus.next(response);
          this.enrollmentStatus = response.enrollment;
          this.walletresponseModel = response;
          this.kycResponse = response.kyc;
        },
        error: (err) => {
          this.walletStatus.next(err);
          this.logService.error(
            "~WalletComponent~enrollment~wallet enrollment errornnnnnnnnnnnnnnnnnn" + err
          );
        },
      });
  }

  walletEnrollment(acceptanceFlag, kycFile, accountNumber) {
    const kycData = new FormData();
    var file = new Blob();
    kycData.append('somename', kycFile);
    const enrollmentRequest = new Enrollment();
    Object.assign(enrollmentRequest, file, this.walletresponseModel);

    enrollmentRequest.acceptance = acceptanceFlag;
    enrollmentRequest.account_number = accountNumber;
    this.restService
      .post(EndpointsConfig.booking.walletenrollment, enrollmentRequest)
      .subscribe({
        next: (response) => {
          this.enrollmentResponse.next(response)
        },
        error: (err) => {
          this.logService.error(
            "~WalletComponent~enrollment~wallet enrollment error" + err
          );
        },
        complete: () => {
          this.walletDetails();
        }
      });
  }

  walletUnenrollment() {
    const unEnrollmentRequest = new Enrollment();
    Object.assign(unEnrollmentRequest, this.walletresponseModel);
    unEnrollmentRequest.header = new RequestHeader();
    this.restService
      .post(EndpointsConfig.booking.walletunenrollment, unEnrollmentRequest)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.unEnrollmentResponse.next(response);
          } else {
            this.logService.error(
              "~WalletComponent~enrollment~wallet enrollment failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.logService.error(
            "~WalletComponent~enrollment~wallet enrollment error" + err
          );
        },
      });
  }

  walletRecharge(walletrRecharge) {
    const walletRechargeRequest = {
      location: "chennai",
      orderAmount: walletrRecharge,
    }

    this.restService
      .post(EndpointsConfig.booking.walletrecharge, walletRechargeRequest)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.walletRechargeResponse.next(response.paymentDetails);
          } else {
            this.logService.error(
              "~WalletComponent ~wallet recharge failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.logService.error(
            "~WalletComponent ~ wallet recharge error" + err
          );
        },
      });
  }
  walletDetails() {
    let headers: any = {
      'Content-Type': 'application/json',
    }
    let httpConfig = { url: EndpointsConfig.booking.wallettransactiondetails, headers: headers }
    this.restService.getWithHeaders(httpConfig)
      .subscribe({
        next: (response) => {
          this.walletTransaction.next(response);
        }
      });
  }

  confirmWalletPayment(payment) {
    const walletPaymentReqeust = new PaymentRequest();
    Object.assign(walletPaymentReqeust, this.booking);
    Object.assign(walletPaymentReqeust, payment);
    walletPaymentReqeust.header = new RequestHeader();
    walletPaymentReqeust.showDetailsId = this.booking.showPublishedId;
    walletPaymentReqeust.userId = "muthazhahi@gmail.com"

    this.restService
      .post(EndpointsConfig.booking.walletpayment, walletPaymentReqeust)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001" || response.status.statusCode === "1002") {
            this.walletPayment.next(response);
          }
          else if (response.status.statusCode === "1005") {
            this.walletPayment.next(response);
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

}
