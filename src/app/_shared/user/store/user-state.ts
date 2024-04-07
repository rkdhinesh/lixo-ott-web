import { State, Action, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { AddUser, DeleteUser, DeleteUsers, UpdateUser } from "./user-action";

//Giving our state a model

@State<User[]>({
  name: "users",
  // defaults is optional
  defaults: [],
})
@Injectable()
export class UserState {
  @Action(AddUser)
  add({ getState, setState }: StateContext<User[]>, { user }: AddUser) {
    setState([...getState(), user]);
  }

  @Action(DeleteUser)
  delete({ getState, setState }: StateContext<User[]>, { userId }: DeleteUser) {
    setState(getState().filter((user) => user.userId === userId));
  }
  @Action(DeleteUsers)
  deleteAll({ setState }: StateContext<User[]>, {}: DeleteUsers) {
    setState( [] as User[]);
  }
  @Action(UpdateUser)
  update({ getState, setState }: StateContext<User[]>, { user }: UpdateUser) {
    setState([
      ...getState().filter((store) => {
        store.userId === user.userId;
      }),
      user,
    ]);
  }
}
