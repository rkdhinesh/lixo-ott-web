import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UserState } from '../store/user-state';
import {
    AddUser,
    DeleteUser,
    UpdateUser,
} from '../store/user-action';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    @Select(UserState)
    public users$: Observable<User[]>;


    constructor(private store: Store) {
    }

    public add(user: User) {
        this.store.dispatch(new AddUser(user));
    }

    public delete(userId: string) {
        this.store.dispatch(new DeleteUser(userId));
    }
    public update(user: User) {
        this.store.dispatch(new UpdateUser(user));
    }

    getUserbyUserId(userId: string): Observable<User> {
        return this.store.select((state) =>
            state.users.filter((user: User) => user.userId === userId)
        );
    }
    getUser(): Observable<User> {
        return this.store.select((state) =>
            state.users
            );
    }
}
