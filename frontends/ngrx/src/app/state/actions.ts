import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.interface';

export const getUsers = createAction('[App Component] Get Users');
export const getUsersSuccess = createAction('[Tasks] Get Users Success', props<{data: User[]}>());
export const updateUsers = createAction('[App Component] Update Users');
export const deleteUsers = createAction('[App Component] Delete Users');
