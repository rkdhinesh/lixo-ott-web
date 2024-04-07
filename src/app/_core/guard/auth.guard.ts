import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StoreService } from "../state/store.service";
import { StoreType } from "../constants/store-type.enum";
import { CommonConstants } from "../constants/common-constants.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: StoreService) {}

  canActivate() {
    if (this.store.get(CommonConstants.LOGGED_IN, StoreType.LOCAL) === true) {
      console.log("loggedin"+this.store.get(CommonConstants.LOGGED_IN, StoreType.LOCAL));
      return true;
    }

    this.router.navigate(["/login"]);
    // return false;

    return false;
  }
}
