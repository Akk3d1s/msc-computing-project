import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.interface';

export const getUsers = createAction('[App Component] Get Users', props<{amount: string}>());
export const getUsersSuccess = createAction('[App Component] Get Users Success', props<{users: User[]}>());
export const addUser = createAction('[App Component] Add User', props<User>());
