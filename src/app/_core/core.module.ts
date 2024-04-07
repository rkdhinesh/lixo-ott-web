import { NgModule, Optional, SkipSelf } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { DashboardModule } from "src/app/_features/dashboard/dashboard.module";
import { LoginModule } from "src/app/_features/login/login.module";
import { BsModalService } from "ngx-bootstrap/modal";
import { ModalModule } from "ngx-bootstrap/modal";
import { LogService } from "../_core/log/log.service";
import { AuthInterceptor } from "./interceptors/auth-interceptor";
import { RestApiService } from "./service/rest-api.service";
import { AuthGuard } from "./guard/auth.guard";
import { TokenGuard } from "./guard/token.guard";
import { TokenStorage } from "./guard/token-storage";
import { ModalService } from "./service/modal.service";
import { ProfileModule } from "../_features/profile/profile.module";
import { ShowsModule } from "../_features/shows/shows.module";
import { BookingModule } from "../_features/booking/booking.module";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "ngx-bootstrap/tooltip";
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    DashboardModule,
    ShowsModule,
    BookingModule,
    BookingModule,
    LoginModule,
    ProfileModule,
    CommonModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    TokenGuard,
    RestApiService,
    TokenStorage,
    LogService,
    ModalService,
    BsModalService,

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import Core modules in the AppModule only.`
      );
    }
  }
}
