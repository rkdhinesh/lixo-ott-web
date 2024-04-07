import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PreferenceComponent } from './preference/preference.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/_shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProfileRouterModule } from './profile-routing.module';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { WalletModule } from '../wallet/wallet.module';
import { LocationModule } from '../location/location.module';
import { ShowsModule } from '../shows/shows.module';
import { NgxPictureModule } from 'ngx-picture';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [
    HistoryComponent,
    EditProfileComponent,
    PreferenceComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRouterModule,
    FormsModule,
    WalletModule,
    ReactiveFormsModule,
    LocationModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    SharedModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ShowsModule,
    NgxPictureModule
  ],
})
export class ProfileModule {
  constructor() { }
}
