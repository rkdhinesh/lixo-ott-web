import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewLocationsComponent } from "./view-locations/view-locations.component";


const routes: Routes = [
  { path: "", component: ViewLocationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
