import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';
import * as UserActions from './actions';
import { map, mergeMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { updateUsersSuccess } from './actions';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersEndpoint: UsersEndpoint) {}

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUsers),
      map((action: {amount: string; type: string}) => action.amount),
      mergeMap(amount => {
        return this.usersEndpoint.getUsers(amount).pipe(
          map(users => UserActions.getUsersSuccess({ users }))
        );
      })
    )
  )

  updateUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUsers),
      map((action: {users: User[]; type: string}) => action.users),
      mergeMap(users => {
        return this.usersEndpoint.updateUsers(users).pipe(
          map(users => UserActions.updateUsersSuccess({ updatedUsers: users }))
        );
      })
    )
  )

  deleteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUsers),
      map((action: {users: User[]; type: string}) => action.users),
      mergeMap(users => {
        return this.usersEndpoint.deleteUsers(users).pipe(
          map(users => UserActions.deleteUsersSuccess({ deletedUsers: users }))
        );
      })
    )
  )
}
