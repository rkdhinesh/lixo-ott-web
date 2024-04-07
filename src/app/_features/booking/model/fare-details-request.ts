import { RequestHeader } from "src/app/_core/model/request-header";
import { SelectedSeatLayout } from "./seat-layout";

export class Faredetailsrequest {
  city: string;
  showDetailsId: number;
  header: RequestHeader;
  // tslint:disable-next-line: variable-name
  seat_layout: SelectedSeatLayout;
}
