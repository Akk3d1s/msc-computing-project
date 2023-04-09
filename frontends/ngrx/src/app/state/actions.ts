import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.interface';

export const getUsers = createAction('[App Component] Get Users', props<{amount: string}>());
export const getUsersSuccess = createAction('[App Component] Get Users Success', props<{users: User[]}>());
export const updateUsers = createAction('[App Component] Update Users', props<{users: User[]}>());
export const updateUsersSuccess = createAction('[App Component] Update Users Success', props<{updatedUsers: User[]}>());
export const deleteUsers = createAction('[App Component] Delete Users', props<{users: User[]}>());
export const deleteUsersSuccess = createAction('[App Component] Delete Users Success', props<{deletedUsers: User[]}>());
