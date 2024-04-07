import { Injectable } from "@angular/core";
import { User } from "src/app/_shared/user/model/user";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { LogService } from "src/app/_core/log/log.service";
import { RequestHeader } from "src/app/_core/model/request-header";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LoginotpService {

  user: User;
  varificationotp = new ReplaySubject(1);
  isErrorVerificationOtp = false;
  otpVerification: boolean;
  constructor(private restService: RestApiService,
    // tslint:disable-next-line: align
    private logService: LogService,) { }



  validationOtp(phoneNumber: string, otp: string) {
    const request = {
      // tslint:disable-next-line: object-literal-shorthand
      phoneNumber: phoneNumber,
      // tslint:disable-next-line: object-literal-shorthand
      otp: otp,
      header: new RequestHeader(),
    };
    this.restService.post(EndpointsConfig.user.validationotp, request).subscribe({
      next: (response) => {
        if (response.status.statusCode === "2001") {
          this.isErrorVerificationOtp = true;
          this.otpVerification = false;
          this.varificationotp.next(response);
        } else if (response.status.statusCode === "3002") {
          this.isErrorVerificationOtp = false;
          this.otpVerification = true;
        } else if (response.status.statusCode === "3001") {
          this.isErrorVerificationOtp = false;
          this.otpVerification = true;
        }
        else {
          this.isErrorVerificationOtp = false;
          this.logService.error(
            "~LoginComponent~validationOtp~validationOtp failed response code " +
            response.status.statusCode +
            "description" +
            response.status.statusDescription
          );
        }
      },
      error: (err) => {

        this.logService.error(
          "~LoginComponent~validationOtp~validationOtp fetech error" + err
        );
      },

    });

  }

}
