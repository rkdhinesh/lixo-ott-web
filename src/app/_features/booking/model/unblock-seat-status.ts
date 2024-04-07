import { RequestHeader } from "src/app/_core/model/request-header";

export class UnblockSeatStatus {
    venueId: number;
    header: RequestHeader;
    seat_layout: UnblockSeat;
    userId: string;
    constructor() {

    }
}

export class UnblockSeat {
    classes: UnBlockSelectedClass[];
    constructor(classes: any) {
        this.classes = classes;
    }
}

export class UnBlockSelectedClass {
    classPublishedId: number;
    seats: SeatStaus[];
    constructor(classPublishedId: number, seats: Array<any>) {
        this.classPublishedId = classPublishedId;
        this.seats = seats;
    }
}

export class SeatStaus {
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


