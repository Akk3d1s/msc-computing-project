import { Injectable, OnDestroy } from '@angular/core';
import { Store } from 'src/app/store';
import { UsersState } from 'src/app/users/users.state';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { UsersEndpoint } from 'src/app/users/users.endpoint';
import { User } from 'src/app/users/user.interface';

@Injectable()
export class UsersStore extends Store<UsersState> implements OnDestroy
{
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _getUsers$: Subject<{amount: string}> = new Subject<{amount: string}>();

  constructor(private _usersEndpoint: UsersEndpoint) {
    super(new UsersState());
    this.initGetUsers$();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getUsers(amount: string): void {
    this._getUsers$.next({ amount });
  }

  addUser(user: User): void {
    this.setState({
      ...this.state,
      users: [...[user], ...this.state.users],
    });
  }

  private initGetUsers$(): void {
    this._getUsers$
      .pipe(
        switchMap(requestData =>
          this._usersEndpoint
            .getUsers(requestData.amount)
        ),
        takeUntil(this._unsubscribe$)
      )
      .subscribe(users => {
          this.setState({
            ...this.state,
            users: users,
          });
      });
  }
}
