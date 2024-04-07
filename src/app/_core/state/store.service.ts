import { Injectable } from "@angular/core";
import { StoreType } from "../constants/store-type.enum";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor() { }

  public put(key: string, value: any, type: StoreType) {
    if (type === StoreType.SESSION) {
      this.putSessionStore(key, value);
    } else if (type === StoreType.LOCAL) {
      this.putLocalStore(key, value);
    }
  }
  public get(key: string, type: StoreType): any {
    if (type === StoreType.SESSION) {
      return this.getFromSessionStore(key);
    } else if (type === StoreType.LOCAL) {
      return this.getFromLocalStore(key);
    }
    return undefined;
  }
  public delete(key: string, type: StoreType): any {
    if (type === StoreType.SESSION) {
      return this.deleteValueFormSessionStore(key);
    } else if (type === StoreType.LOCAL) {
      return this.deleteValueFormLocalStore(key);
    }
    return undefined;
  }
  public clear(type: StoreType) {
    if (type === StoreType.SESSION) {
      return this.clearSessionStore();
    } else if (type === StoreType.LOCAL) {
      return this.clearLocalStore();
    }
  }

  private putSessionStore(key: string, value: any) {
    window.sessionStorage.setItem(key, value);
  }
  private putLocalStore(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }
  private getFromSessionStore(key: string) {
    return window.sessionStorage.getItem(key);
  }
  private getFromLocalStore(key: string) {
    return window.localStorage.getItem(key);
  }
  private deleteValueFormSessionStore(key: string) {
    window.sessionStorage.removeItem(key);
  }
  public deleteValueFormLocalStore(key: string) {
    window.localStorage.removeItem(key);
  }
  public clearSessionStore() {
    window.sessionStorage.clear();
  }
  public clearLocalStore() {
    window.localStorage.clear();
  }
}
