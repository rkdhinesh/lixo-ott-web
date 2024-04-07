import { Injectable } from "@angular/core";
import { StoreService } from "../state/store.service";
import { StoreType } from "../constants/store-type.enum";
import { CommonConstants } from "../constants/common-constants.enum";

@Injectable()
export class TokenStorage {
  token: string;

  constructor(private store: StoreService) { }

  signOut() {
    this.store.delete(CommonConstants.TOKEN_KEY, StoreType.LOCAL);
    this.store.delete(CommonConstants.REFRESH_TOKEN_KEY, StoreType.LOCAL);
    this.store.delete(CommonConstants.CURRENT_USER, StoreType.SESSION);
    this.store.delete(CommonConstants.MODULE, StoreType.SESSION);
    this.store.put(CommonConstants.LOGGED_IN, false, StoreType.LOCAL);
  }

  public saveToken(token: string, refreshToken: string) {
    this.store.delete(CommonConstants.TOKEN_KEY, StoreType.LOCAL);
    this.store.delete(CommonConstants.REFRESH_TOKEN_KEY, StoreType.LOCAL);
    this.store.put(CommonConstants.TOKEN_KEY, token, StoreType.LOCAL);
    this.store.put(
      CommonConstants.REFRESH_TOKEN_KEY,
      refreshToken,
      StoreType.LOCAL
    );
  }

  public getToken(): string {
    return this.store.get(CommonConstants.TOKEN_KEY, StoreType.LOCAL);
  }

  public getRefreshToken(): string {
    return this.store.get(CommonConstants.REFRESH_TOKEN_KEY, StoreType.LOCAL);
  }
}
