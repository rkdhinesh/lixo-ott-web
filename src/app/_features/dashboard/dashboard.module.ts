import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { LoginModule } from '../login/login.module';
import { NowShowingComponent } from './now-showing/now-showing.component';
import { UpComingComponent } from './up-coming/up-coming.component';
import { TopRatedComponent } from './top-rated/top-rated.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselComponent } from './carousel/carousel.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SharedModule } from 'src/app/_shared/shared.module';
import { NavigationComponent } from './navigation/navigation.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocationModule } from '../location/location.module';
import { DimensionComponent } from './dimension/dimension.component';
import { ShowsModule } from '../shows/shows.module';
import { FormsModule } from '@angular/forms';
import { NgxPictureModule } from 'ngx-picture';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { RentalPurchaseComponent } from './rental-purchase/rental-purchase.component';
import { TestComponent } from './test/test.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    DashboardComponent,
    NowShowingComponent,
    UpComingComponent,
    TopRatedComponent,
    CarouselComponent,
    NavigationComponent,
    DimensionComponent,
    MovieDetailComponent,
    RentalPurchaseComponent,
    TestComponent,
  


  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    LoginModule, 
    NgxPictureModule,
    SlickCarouselModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 4,
      innerStrokeWidth: 0,
      outerStrokeColor: "#EFEFEF",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      responsive:true,
      showTitle:false,
      showSubtitle:false,
      showUnits:false
    }),

    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    SharedModule,
    LocationModule,
    ShowsModule
  ],
})
export class DashboardModule { }
