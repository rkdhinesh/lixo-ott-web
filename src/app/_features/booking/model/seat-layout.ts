export class SeatLayout {
  classes: Class[];
}
export class Class {
  seatId: string;
  // tslint:disable-next-line: variable-name
  total_rows: number;
  // tslint:disable-next-line: variable-name
  total_columns: number;
  labels: Labels[];
  classPublishedId: number;
  classId: number;
  className: string;
  baseFare: number;
  extraFare: number;
  discount: number;
  // tslint:disable-next-line: variable-name
  fare_id: number;
  // tslint:disable-next-line: variable-name
  fare_details?: any;
}

export class Labels {
  groupId: string;
  seats: Seat[];
}
export class Seat {
  seat: boolean;
  seatId: number;
  seatsPublishedId: number;
  coordinateX: string;
  coordinatey: string;
  seatNumber: string;
  rowLabel: string;
  // tslint:disable-next-line: variable-name
  is_seat: boolean;
  // tslint:disable-next-line: variable-name
  bookingStatus: string;
  // tslint:disable-next-line: variable-name
  selectedstatus_ui: number;
}
export class SelectedSeatLayout {
  classes: SelectedClass;
  constructor(classes: any) {
    this.classes = classes;
  }
}

export class SelectedClass {
  classPublishedId: number;
  labels: Seat[];
  constructor(classPublishedId: number, seats: Array<any>) {
    this.classPublishedId = classPublishedId;
    this.labels = seats;
  }
}

export class UnBlockSelectedSeatLayout {
  classes: UnBlockSelectedClass;
  constructor(classes: any) {
    this.classes = classes;
  }
}

export class UnBlockSelectedClass {
  classPublishedId: number;
  seats: Seat[];
  constructor(classPublishedId: number, seats: Array<any>) {
    this.classPublishedId = classPublishedId;
    this.seats = seats;
  }
}
