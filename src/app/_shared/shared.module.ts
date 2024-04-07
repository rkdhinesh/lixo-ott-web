import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { environment } from 'src/environments/environment';
import { UserState } from './user/store/user-state';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MovieState } from './movie/store/movie-state';
import { LoginModule } from '../_features/login/login.module';
import { LocationModule } from '../_features/location/location.module';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ServerErrorComponent } from './server-error/server-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CardComponent } from './card/card.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BookingState } from './booking/store/booking.state';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HighlightPipe } from '../_features/highlight.pipe';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [HeaderComponent, FooterComponent, ServerErrorComponent, NotFoundComponent, CardComponent, ContactUsComponent,
    PrivacyPolicyComponent, TermsAndConditionsComponent, FaqComponent, HighlightPipe
  ],
  imports: [
    CommonModule,
    LoginModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    NgxsModule.forRoot([UserState, MovieState, BookingState], {
      developmentMode: !environment.production
    }),
    NgxsDispatchPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    BsDropdownModule.forRoot(),
    LocationModule,
    NgCircleProgressModule,
    NgCircleProgressModule.forRoot({
      backgroundGradientStopColor: '#FFAF29',
      radius: 20,
      space: 10,
      maxPercent: 100,
      outerStrokeGradient: true,
      outerStrokeWidth: 10,
      outerStrokeColor: '#000',
      outerStrokeGradientStopColor: '#FFAF29',
      innerStrokeColor: '#000',
      innerStrokeWidth: 10,
      title: 'UI',
      titleColor: '#fbfbfb',
      animateTitle: false,
      animationDuration: 1000,
      showSubtitle: false,
      showUnits: false,
      showBackground: false,
      startFromZero: false,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [HeaderComponent, FooterComponent, ServerErrorComponent, CardComponent, HighlightPipe],
  providers: [TitleCasePipe]

})
export class SharedModule { }
