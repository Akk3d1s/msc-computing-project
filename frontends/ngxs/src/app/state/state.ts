import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { User } from 'src/app/interfaces/user.interface';
import { Users } from 'src/app/state/actions';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';
import { tap } from 'rxjs';


@State<User[]>({
    name: 'users',
    defaults: []
})
@Injectable()
export class UsersState {
    constructor(private usersEndpoint: UsersEndpoint) {
    }

    @Action(Users.Get)
    getUsers(ctx: StateContext<User[]>, action: Users.Get) {
        return this.usersEndpoint.getUsers(action.amount).pipe(
            tap(users => {
                ctx.setState(users);
            })
        );
    }

    @Action(Users.Update)
    updateUsers(ctx: StateContext<User[]>, action: Users.Update) {
        const state = ctx.getState();
        return this.usersEndpoint.updateUsers(action.users).pipe(
            tap(updatedUsers => {
                const users = state.map(user => {
                    const matchingUser = updatedUsers.find(u => u.userId === user.userId);
                    if (!!matchingUser) {
                        return matchingUser;
                    }
                    return user;
                });
                ctx.setState(users);
            })
        );
    }

    @Action(Users.Delete)
    deleteUsers(ctx: StateContext<User[]>, action: Users.Delete) {
        const state = ctx.getState();
        return this.usersEndpoint.deleteUsers(action.users).pipe(
            tap(deletedUsers => {
                const users = state.filter(user => !deletedUsers.find(u => u.userId === user.userId))
                ctx.setState(users);
            })
        );
    }
}
