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

    @Action(Users.Add)
    AddUser(ctx: StateContext<User[]>, action: Users.Add) {
        const state = ctx.getState();
        ctx.setState([...[action.user], ...state])
    }
}
