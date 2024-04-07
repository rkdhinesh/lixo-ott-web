import { Booking } from '../ model/booking';

export class AddBooking {
  static type = "[BOOKING] AddBooking";
  constructor(public readonly payload: Booking) {}
}

export class DeleteBooking {
  static type = "[BOOKING] DeleteBooking";
  constructor() {}
}
export class UpdateBooking {
  static type = "[BOOKING] UpdateBooking";
  constructor(public readonly payload: Booking) {}
}
