import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserReducer from './reducers';

export const getUsersState = createFeatureSelector<fromUserReducer.State>('users');

export const getUsers = createSelector(
  getUsersState,
  (state: fromUserReducer.State) => state.users
);
