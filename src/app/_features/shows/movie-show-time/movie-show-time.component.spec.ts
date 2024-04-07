import { MovieShowTimeComponent } from "./movie-show-time.component";
import { ShowTimeService } from "../service/show-time.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { ShowService } from "../../dashboard/service/show.service";
import { MovieService } from "../service/movie.service";
import { Router } from "@angular/router";
import { MovieStateService } from "src/app/_shared/movie/service/movie-state.service";

fdescribe("MovieComponent", () => {
  let component: MovieShowTimeComponent;
  let showsTimeService: ShowTimeService;
  let modalservice: ModalService;
  let showService: ShowService;
  let router: Router;
  let movieService: MovieService;
  let movieStateService: MovieStateService;

  beforeEach(() => {
    component = new MovieShowTimeComponent(
      showsTimeService,
      modalservice,
      showService,
      router,
      movieService,
      movieStateService
    );
  });
  it("should create MovieShowTimeComponent", () => {
    expect(component).toBeInstanceOf(MovieShowTimeComponent);
  });
});
