import { IMovie } from "src/app/_features/shows/model/movie";

export class AddMovie {
  static type = "[MOVIE] AddMovie";
  constructor(public readonly movie: IMovie) {}
}

export class DeleteMovie {
  static type = "[MOVIE] AddMovie";
  constructor(public readonly index: number) {}
}
export class DeleteMovies {
  static type = "[MOVIE] DeleteMovies";
  constructor() {}
}
