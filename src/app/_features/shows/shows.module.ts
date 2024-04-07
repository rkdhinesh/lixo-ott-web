import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueShowTimeComponent } from './venue-show-time/venue-show-time.component';
import { MovieShowTimeComponent, SplitAndGetPipe } from './movie-show-time/movie-show-time.component';
import { DaynightPipe } from './daynight.pipe';
import { ShowsRoutingModule } from './shows-routing.module';
import { SeatCountComponent } from './seat-count/seat-count.component';
import { MovieComponent } from './movie/movie.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { UserreviewComponent } from './userreview/userreview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenueShowsTermsComponent } from './venue-shows-terms/venue-shows-terms.component';
import { MovieShowsTermsComponent } from './movie-shows-terms/movie-shows-terms.component';
import { SharedModule } from 'src/app/_shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {
    TranslateModule,
    TranslateLoader,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginModule } from '../login/login.module';
import { ShowTooltipComponent } from './show-tooltip/show-tooltip.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxPictureModule } from 'ngx-picture';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    declarations: [
        MovieShowTimeComponent,
        VenueShowTimeComponent,
        SeatCountComponent,
        DaynightPipe,
        MovieComponent,
        UserreviewComponent,
        VenueShowsTermsComponent,
        MovieShowsTermsComponent,
        ShowTooltipComponent,
        SplitAndGetPipe,
    ],
    imports: [
        CommonModule,
        ShowsRoutingModule,
        SlickCarouselModule,
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        CarouselModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPictureModule,
        LoginModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [DaynightPipe, SeatCountComponent, VenueShowsTermsComponent, MovieShowsTermsComponent, VenueShowTimeComponent, SplitAndGetPipe],
})
export class ShowsModule {}
