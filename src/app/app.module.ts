import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './_core/core.module';
import { SharedModule } from './_shared/shared.module';
import { DatePipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,

} from 'angularx-social-login';
import { DEFAULT_BREAKPOINTS, ImageFormat, NgxPictureModule } from 'ngx-picture';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { LoginModule } from './_features/login/login.module';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
export function srcInterpolator(
  url: string,
  imageFormat: ImageFormat,
  // breakpoint: string,
  // breakpointValue: number
) {
  let validUrl = url.substring(0, url.lastIndexOf('.'))
  return `${validUrl}.${imageFormat === 'jpeg' ? 'jpg' : 'webp'
    }`;
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TabsModule.forRoot(),
    NgxPictureModule.forRoot({
      breakpoints: DEFAULT_BREAKPOINTS, //2. the break points to create sources for
      imageFormats: ['webp', 'jpeg'], //3. the image formats to create sources for. *
      srcInterpolator
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [DatePipe, { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '305978610917-gq2u6flbtfipr1rc4fujvoivoqspl9pv.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('505158357865300'),
          },

        ],
      } as SocialAuthServiceConfig,
    }],
  bootstrap: [AppComponent],
  exports: [DatePipe, TabsModule, BsDropdownModule],
})
export class AppModule { }
