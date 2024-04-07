import { State, Action, StateContext } from "@ngxs/store";
import { AddMovie, DeleteMovie, DeleteMovies } from "./movie-action";
import { IMovie } from "src/app/_features/shows/model/movie";
import { Injectable } from "@angular/core";

// Giving our state a model

@State<IMovie[]>({
  name: "movies",
  // defaults is optional
  defaults: [],
})
@Injectable()
export class MovieState {
  // Add contact action
  // @Action(AddMovie)
  // add({ getState, setState }: StateContext<IMovie[]>, { movie }: AddMovie) {
  //   console.log(getState());
  //   setState([...getState(), movie]);
  // }

  @Action(AddMovie)
  add(ctx: StateContext<IMovie[]>, { movie }: AddMovie) {
    ctx.setState([ ...ctx.getState(), movie  ]);
  }

  // Delete contact action
  @Action(DeleteMovie)
  delete(
    { getState, setState }: StateContext<IMovie[]>,
    { index }: DeleteMovie
  ) {
    setState(getState().filter((i) => i !== index));
  }
  @Action(DeleteMovies)
  deleteAll({ setState }: StateContext<IMovie[]>, { }: DeleteMovies) {
    setState([]);
  }
}
