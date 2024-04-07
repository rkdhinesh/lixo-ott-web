import { Injectable, Injector } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppInjectorService {
  private static injector: Injector;

  constructor() {}

  static setInjector(injector: Injector) {
    AppInjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return AppInjectorService.injector;
  }
}
