export class Show {
  showPublishedId: number;
  screenId: number;
  showTime: string;
  showDate: string;
  screenPublishedId: number;
  classes: Class[];
  soldoutDisable: boolean = false;
  classesValues: number = 0;
  totalClassesValues: number = 0;
  boxOfficeOnlyFlag: boolean;

}
export class Class {
  classId: number;
  baseFare: number;
  fareId: number;
  availableSeats: number;
  discount: number;
  className: string;
  classPublishedId: number;
  extraFare: number;
  totalSeats: number;
  statusMessage: string;
  statusColor: string;


}
