import { Injectable } from "@angular/core";
import { RestApiService } from "src/app/_core/service/rest-api.service";
import { TokenStorage } from "src/app/_core/guard/token-storage";
import { LogService } from "src/app/_core/log/log.service";
import { User } from "src/app/_shared/user/model/user";
import { RequestHeader } from "src/app/_core/model/request-header";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ResetPassword } from '../../booking/model/reset-password';


@Injectable({
  providedIn: "root",
})
export class ForgotPasswordService {
 
  forgotpassword = new Subject();
  updatepassword = new Subject();
  resetPasswordParam: any;
  isErrorPassword = false;
  isErrorResetToken = false;
  isErrorResetPassword = false;
  constructor(
    private restService: RestApiService,
    private token: TokenStorage,
    private logService: LogService,
    private route: ActivatedRoute,
  
  ) { }

  forgotPassword(user: User): any {
  
    user.header = new RequestHeader();

      
    this.restService.post(EndpointsConfig.user.forgotpassword,user).subscribe({
      next: (response) => {
        if (response.status.statusCode === "2001") {
          this.forgotpassword.next(response);
          this.isErrorPassword = true;
          this.logService.info(
            "~LoginComponent~forgotPassword~forgotPassword successfully"
          );
        } else if (response.status.statusCode === "3001") {
          this.isErrorPassword = false;
        } else if (response.status.statusCode === "3002") {
          this.forgotpassword.next(response);
          this.isErrorPassword = false;
        } else {
          this.logService.error(
            "~LoginComponent~forgotPassword~forgotPassword failed response code " +
            response.status.statusCode +
            "description" +
            response.status.statusDescription
          );
        }
      },
      error: (err) => {
        this.logService.error(
          "~LoginComponent~forgotPassword~forgotPassword fetech error" + err
        );
      },
    });
  }

  resetPasswordToken() {
    this.resetPasswordParam = this.route.snapshot.queryParams["token"];
    this.token.saveToken(this.resetPasswordParam, this.resetPasswordParam);
    this.restService
      .post(EndpointsConfig.user.resetpasswordtoken, {
        header: new RequestHeader(),
      })
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "2001") {
            this.isErrorResetToken = true;
            this.token.saveToken(
              this.resetPasswordParam,
              this.resetPasswordParam
            );
          } else {
            this.logService.error(
              "~LoginComponent~resetpswToken~resetpswToken failed response code " +
              response.status.statusCode +
              "description" +
              response.status.statusDescription
            );
          }
        },
        error: (err) => {
          this.logService.error(
            "~LoginComponent~resetpswToken~resetpswToken fetech error" + err
          );
        },
      });
  }

  resetPassword(user: User): any {
    const resetpassword = new ResetPassword();
    resetpassword.password = user.password;
    resetpassword.header = new RequestHeader();
    this.restService.post(EndpointsConfig.user.resetpassword, resetpassword).subscribe({
      next: (response) => {
        if (response.status.statusCode === "2001") {
          this.updatepassword.next(response);
          this.isErrorResetPassword = false;
        } else {
          this.isErrorResetPassword = true;
          this.logService.error(
            "~LoginComponent~resetPassword~resetPassword failed response code " +
            response.status.statusCode +
            "description" +
            response.status.statusDescription
          );
        }
      },
      error: (err) => {
        this.isErrorResetPassword = true;
        this.logService.error(
          "~LoginComponent~resetPassword~resetPassword fetech error" + err
        );
      },
    });
  }
}
