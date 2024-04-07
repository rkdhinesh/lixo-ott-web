import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { PreferenceComponent } from "./preference/preference.component";
import { HistoryComponent } from "./history/history.component";

const routes: Routes = [
  {
    path: "",
    component: EditProfileComponent,
    children: [
      {
        path: "preference",
        component: PreferenceComponent,
      },
      {
        path: "booking-history",
        component: HistoryComponent,
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRouterModule {
  constructor() {
  }
}
