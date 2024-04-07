import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class StyleChangeService {
  homestyle$: Observable<boolean>;
  // private boolSubject: Subject<boolean>;
  private homestyle: Subject<boolean>;
  constructor() {

    this.homestyle = new Subject<boolean>();
    this.homestyle$ = this.homestyle.asObservable();
  }
  changeHomeStyle() {
    this.homestyle.next(true);
  }
}
