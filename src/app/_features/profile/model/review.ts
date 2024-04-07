import { RequestHeader } from "src/app/_core/model/request-header";

export class Review {
  movieId?: number;
  title: string;
  comments: string;
  rating: number;
  userId: string;
  header: RequestHeader;
  reviewDate: string;
  companyId?: string;
  systemId?: string;
}
