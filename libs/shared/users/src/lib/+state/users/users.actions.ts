import { createAction, props } from '@ngrx/store';
import { SharedUsersEntity } from './users.models';

export const initUsers = createAction('[SharedUsers Page] Init');

export const loadUsersSuccess = createAction(
  '[SharedUsers/API] Load SharedUsers Success',
  props<{ users: SharedUsersEntity[] }>()
);

export const loadUsersFailure = createAction(
  '[SharedUsers/API] Load SharedUsers Failure',
  props<{ error: any }>()
);

export const removeUser = createAction(
  '[SharedUsers] Remove User',
  props<{ userId: string }>()
);

export const addUser = createAction(
  '[SharedUsers] Add User',
  props<{ user: SharedUsersEntity }>()
);

export const updateUser = createAction(
  '[SharedUsers] Update User',
  props<{ user: SharedUsersEntity }>()
);
