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
  on(UserActions.addUser, (state, addedUser) => {
    const users = [...[addedUser], ...state.users];

    return {
      ...state,
      users
    }
  }),
);
