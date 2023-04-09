import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';
import * as UserActions from './actions';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersEndpoint: UsersEndpoint) {}

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUsers),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.usersEndpoint.getUsers('10').pipe(
          map(users => UserActions.getUsersSuccess({ data: users }))
        );
      })
    )
  )
}
