import { ActionReducerMap } from '@ngrx/store';
import * as fromUserReducer from './reducers';

export interface State { users : fromUserReducer.State}
export const reducers: ActionReducerMap<State> = {users: fromUserReducer.usersReducer };
