import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { TokenStorage } from "./token-storage";
import { RestApiService } from "../service/rest-api.service";
import { CommonConstants } from "../constants/common-constants.enum";
import { UserService } from "src/app/_shared/user/service/user.service";
import { User } from "src/app/_shared/user/model/user";
import { LogService } from '../log/log.service';
import { environment } from "src/environments/environment";
import { StoreService } from "../state/store.service";
import { StoreType } from "../constants/store-type.enum";

@Injectable()
export class TokenGuard implements CanActivate {
  success = false;
  ihttpConfig: any;
  constructor(
    private router: Router,
    private restService: RestApiService,
    private token: TokenStorage,
    private userService: UserService,
    private log: LogService,
    private storeService: StoreService


  ) { }

  canActivate() {
    if (this.token.getToken()) {
      console.log("token status" + this.token.getToken());
      return true;
    } else {
      const user = new User();
      user.passCode = "";
      user.userId = CommonConstants.GUEST_USER;
      user.header = {
        callingAPI: "moviepanda-web-ui",
        channel: "web",
        transactionId: new Date().getTime().toString()
      }
      var companyId = `${environment.companyId}`;
      var defaultLocation = `${environment.defaultLocation}`;
      if (companyId) {
        if (defaultLocation !== undefined && companyId != "-999") {
          this.storeService.put("moviepanda.location", defaultLocation, StoreType.LOCAL)
        }
      }
      this.login(user)
      return false;
    }

  }

  private login(user: User) {
    this.restService
      .post(EndpointsConfig.user.login, user)
      .subscribe({
        next: (response) => {
          if (response.status.statusCode === "1001") {
            this.token.saveToken(response.token, response.refreshToken);

            this.userService.delete(user.userId);
            this.userService.add(user);
            this.router.navigate(["/"]);
            return true;
          } else if (response.status.statusCode === "3001") {
            return false;
          }
        },
        error: (err) => {
          this.log.error("error in token authentication : " + err);
          this.router.navigate(["error"]);
        },
      });
  }
}
