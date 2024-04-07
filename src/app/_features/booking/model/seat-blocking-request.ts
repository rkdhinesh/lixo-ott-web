import { RequestHeader } from "src/app/_core/model/request-header";
import { Seat, SelectedSeatLayout } from "./seat-layout";

export class SeatBlockingRequest {
  city: string;
  classId: number;
  movieId: number;
  screenId: number;
  paymentId: string;
  showDetailsId: number;
  venueId: number;
  header: RequestHeader;
  // tslint:disable-next-line: variable-name
  seat_layout: SelectedSeatLayout;
  seats: Seat[];
  venueConsent: string;
  movieConsent: string;
  companyId?: number;
  systemId?: string;
}
