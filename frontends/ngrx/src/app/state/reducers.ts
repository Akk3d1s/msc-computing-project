import {
  createReducer,
  on
} from '@ngrx/store';
import { User } from 'src/app/interfaces/user.interface';
import * as UserActions from './actions';

export interface State {
  users: User[]
}

export const initialState: State = {
  users: []
};

export const usersReducer = createReducer(
  initialState,
  on(UserActions.getUsersSuccess, (state, { users }) => ({
    ...state,
    users: users
  })),
  on(UserActions.updateUsersSuccess, (state, { updatedUsers }) => ({
    ...state,
    users: state.users.map(user => {
      const matchingUser = updatedUsers.find(u => u.userId === user.userId);
      if (!!matchingUser) {
        return matchingUser;
      }
      return user;
    }),
  })),
  on(UserActions.deleteUsersSuccess, (state, { deletedUsers }) => ({
    ...state,
    users: state.users.filter(user => !deletedUsers.find(u => u.userId === user.userId)),
  })),
);
