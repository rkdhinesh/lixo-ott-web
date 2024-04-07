import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { Routes, RouterModule } from "@angular/router";
import { TokenGuard } from "src/app/_core/guard/token.guard";
import { MovieDetailComponent } from "./movie-detail/movie-detail.component";


export const routes: Routes = [

  { path: "", component: DashboardComponent, canActivate: [TokenGuard], },

  { path: "movie-detail", component: MovieDetailComponent, canActivate: [TokenGuard], }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
  constructor() {
    console.log("DashboardRoutingModule");
  }
}
