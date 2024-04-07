import { Injectable } from '@angular/core';
import { Booking } from '../ model/booking';
import { AddBooking, DeleteBooking, UpdateBooking } from '../store/booking.action';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private store: Store) { }

public save(booking: Booking) {
    this.store.dispatch(new AddBooking(booking));
}
public update(booking: Booking) {
  this.store.dispatch(new UpdateBooking(booking));
}


public delete() {
    this.store.dispatch(new DeleteBooking());
}

public get(): Observable<Booking> {
  return this.store.select((state) => state.booking.booking);
}
}
