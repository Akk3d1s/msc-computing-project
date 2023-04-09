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
  on(UserActions.getUsers, state => ({ ...state })),
  on(UserActions.getUsersSuccess, (state, { data }) => ({
    ...state,
    users: data
  })),
);
