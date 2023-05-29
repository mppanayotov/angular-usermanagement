import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as SharedUsersActions from './users.actions';
import { SharedUsersEntity } from './users.models';

export const USERS_FEATURE_KEY = 'users';

export interface SharedUsersState extends EntityState<SharedUsersEntity> {
  selectedId?: string | number; // which SharedUsers record has been selected
  loaded: boolean; // has the SharedUsers list been loaded
  error?: string | null; // last known error (if any)
}

export interface SharedUsersPartialState {
  readonly [USERS_FEATURE_KEY]: SharedUsersState;
}

export const usersAdapter: EntityAdapter<SharedUsersEntity> =
  createEntityAdapter<SharedUsersEntity>();

export const initialUsersState: SharedUsersState = usersAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const reducer = createReducer(
  initialUsersState,
  on(SharedUsersActions.initUsers, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SharedUsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loaded: true })
  ),
  on(SharedUsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(SharedUsersActions.removeUser, (state, { userId }) => {
    return usersAdapter.removeOne(userId, state);
  }),
  on(SharedUsersActions.addUser, (state, { user }) => {
    return usersAdapter.addOne(user, state);
  }),
  on(SharedUsersActions.updateUser, (state, { user }) => {
    return usersAdapter.setOne(user, state);
  })
);

export function usersReducer(
  state: SharedUsersState | undefined,
  action: Action
) {
  return reducer(state, action);
}
