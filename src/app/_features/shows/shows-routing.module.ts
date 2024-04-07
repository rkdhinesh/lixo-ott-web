import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MovieShowTimeComponent } from "../shows/movie-show-time/movie-show-time.component";
import { VenueShowTimeComponent } from "../shows/venue-show-time/venue-show-time.component";
import { MovieComponent } from './movie/movie.component';

const routes: Routes = [
  {
    path: "",
    component: MovieShowTimeComponent,
  },
  {
    path: "venues-show-time",
    component: VenueShowTimeComponent,
  },
  {
    path: "movie",
    component: MovieComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowsRoutingModule { }
