import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { IMovie, Movie } from "src/app/_features/shows/model/movie";


@Injectable({
  providedIn: "root",
})
export class MovieStateService {
  constructor(private store: Store) {}

  getNowShowingMovies(): Observable<IMovie[]> {
    return this.store.select((state) => state.movies);
  }
  getMovie(movieId: number): Observable<IMovie> {
    return this.store.select((state) =>
      state.movies.filter((movie: Movie) => movie.movieId === movieId)
    );
  }
}
