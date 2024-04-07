import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatLayoutComponent } from './seat-layout/seat-layout.component';
import { SummaryComponent } from './summary/summary.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BookingRoutingModule } from './booking-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FailureComponent } from './failure/failure.component';
import {
    TranslateModule,
    TranslateLoader,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ShowsModule } from '../shows/shows.module';
import { LoginModule } from '../login/login.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../_shared/shared.module';
import { NgxPictureModule } from 'ngx-picture';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        SeatLayoutComponent,
        SummaryComponent,
        ConfirmationComponent,
        FailureComponent,
    ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        SlickCarouselModule,
        AccordionModule,
        FormsModule,
        LoginModule,
        NgxPictureModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ShowsModule,
        SharedModule,
    ],
    exports: [],
})
export class BookingModule {}
