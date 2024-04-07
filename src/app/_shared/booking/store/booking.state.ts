import { State, Action, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { Booking } from '../ model/booking';
import { AddBooking, DeleteBooking, UpdateBooking } from './booking.action';
// import { ObjectUtil } from 'src/app/_core/util/object.util';

@State<BookingModal>({
    name: "booking",
    // defaults is optional
    defaults: {
      booking: {} as Booking
    },
  })

@Injectable()
export class BookingState {
  // Add or Update action
  // @Action(AddBooking)
  // add({ setState }: StateContext<BookingModal>, { booking }: AddBooking) {
  //   setState((state: BookingModal) => ({
  //     booking: Object.assign(state.booking,booking)
  //   }));
  // }

  @Action(AddBooking)
  add(ctx: StateContext<BookingModal>, { payload }: AddBooking) {
    ctx.setState({ ...ctx.getState(), booking: payload  });
  }
  // @Action(UpdateBooking)
  // update({ setState }: StateContext<BookingModal>, { payload }: UpdateBooking) {
  //   setState((state: BookingModal) => ({
  //     booking: Object.assign(state.booking,payload)
  //   }));
  // }
  @Action(UpdateBooking)
  update(ctx: StateContext<BookingModal>, { payload }: UpdateBooking) {
    ctx.patchState({ ...ctx.getState(), booking: payload  });
  }
  // @Action(DeleteBooking)
  // delete({ setState }: StateContext<BookingModal>, { payload }: DeleteBooking) {
  //   setState((state: BookingModal) => ({
  //     booking: Object.assign(state.booking,{payload})
  //   }));
  // }
  @Action(DeleteBooking)
  delete(ctx: StateContext<BookingModal>, {}: DeleteBooking) {
    ctx.patchState({ ...ctx.getState(), booking: {} as Booking  });
  }

}
// Giving our state a model
export interface BookingModal {
  booking: Booking;
}
