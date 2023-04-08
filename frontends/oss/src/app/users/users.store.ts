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
  private _deleteUsers$: Subject<{users: User[]}> = new Subject<{users: User[]}>();
  private _updateUsers$: Subject<{users: User[]}> = new Subject<{users: User[]}>();

  constructor(private _usersEndpoint: UsersEndpoint) {
    super(new UsersState());
    this.initGetUsers$();
    this.initDeleteUsers$();
    this.initUpdateUsers$();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getUsers(amount: string): void {
    this._getUsers$.next({ amount });
  }

  deleteUsers(users: User[]): void {
    this._deleteUsers$.next({users});
  }

  updateUsers(users: User[]): void {
    this._updateUsers$.next({users});
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

  private initDeleteUsers$(): void {
    this._deleteUsers$
      .pipe(
        switchMap(requestData =>
          this._usersEndpoint
            .deleteUsers(requestData.users)
        ),
        takeUntil(this._unsubscribe$)
      )
      .subscribe(users => {
        this.setState({
          ...this.state,
          users: this.state.users.filter(user => !users.find(u => u.userId === user.userId)),
        });
      });
  }

  private initUpdateUsers$(): void {
    this._updateUsers$
      .pipe(
        switchMap(requestData =>
          this._usersEndpoint
            .updateUsers(requestData.users)
        ),
        takeUntil(this._unsubscribe$)
      )
      .subscribe(updatedUsers => {
        this.setState({
          ...this.state,
          users: this.state.users.map(user => {
            const matchingUser = updatedUsers.find(u => u.userId === user.userId);
            if (!!matchingUser) {
              return matchingUser;
            }
            return user;
          }),
        });
      });
  }
}
