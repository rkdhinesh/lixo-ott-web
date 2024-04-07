// tslint:disable-next-line: no-empty-interface
export interface IMovie { }

export class Movie implements IMovie {
  movieId: number;
  movieName: string;
  synopsis: string;
  overAllRating: number;
  duration: any;
  censorCertificate: string;
  upVotes: any;
  upcomingFlag: any;
  active: number;
  dimension: any;
  language: string;
  posterUrl: any;
  trailerUrl: any;
  casts: Cast[];
  crews: Crew[];
  genres: Genres[];
  criticReviews: CriticReview[];
  userReviews: UserReview[];
  movieChoice: MovieChoice[];
}

export class Cast {
  cineastId: number;
  cineastName: string;
  profileImage: string;
  roleId: number;
  roleName: string;
  roleDescription: string;
  roleType: string;
  displayOrder: number;
}

export class Crew {
  cineastId: number;
  cineastName: string;
  profileImage: string;
  roleId: number;
  roleName: string;
  roleDescription: string;
  roleType: string;
  displayOrder: number;
}


export interface AvailableOption {
  movieId: number;
  dimension: string;
}
export interface MovieChoice {
  language: string;
  availableOptions: AvailableOption[];
}
export interface Genres {
  genreId: number;
  genreName: string;
  description: string;
}

export interface CriticReview {
  reviewId: number;
  comments: string;
  rating: number;
  reviewDate: Date;
  userId: string;
  criticName: string;
  movieId: number;
  title: string;
}

export interface UserReview {
  reviewId: number;
  comments: string;
  rating: number;
  reviewDate: Date;
  userId: string;
  criticName: string;
  movieId: number;
  title: string;
}
