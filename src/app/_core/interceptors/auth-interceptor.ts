import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { TokenStorage } from "../guard/token-storage";
import { LogService } from "../log/log.service";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: TokenStorage,
    private log: LogService, private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.log.info("AuthInterceptor called ...");
    // Get the auth token from the service.
    const authToken = this.auth?.getToken();
    if (authToken != null || authToken != undefined) {
      var token = authToken
      var decoded: any = jwt_decode(token);
      var convertdate = decoded.exp * 1000;
      var ExpiryDate = new Date(convertdate)
      var currentDate: any = new Date();
      if (currentDate > ExpiryDate) {
        this.log.info("Token expired");
      //  alert("Your session was timed out")
        localStorage.clear();
        if (this.router.url === '/') {
          window.location.reload();
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.log.info("Token not expired");
      }
    }
    // Clone the request and set the new header in one step.

    const clonedRequest = req.clone({
      headers: req.headers
        // .set('Cache-Control','no-cache')
        // .set('Content-Type',contentType)
        // .set('Pragma','no-cache')
        .set("Authorization", "Bearer " + authToken),
    });

    // this.log.info('Bearer ' + authToken);
    // send cloned request with header to the next handler.
    return next.handle(clonedRequest);
  }
}
