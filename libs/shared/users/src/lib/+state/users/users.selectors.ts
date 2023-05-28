import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  USERS_FEATURE_KEY,
  SharedUsersState,
  usersAdapter,
} from './users.reducer';

// Lookup the 'SharedUsers' feature state managed by NgRx
export const selectUsersState =
  createFeatureSelector<SharedUsersState>(USERS_FEATURE_KEY);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const selectUsersLoaded = createSelector(
  selectUsersState,
  (state: SharedUsersState) => state.loaded
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: SharedUsersState) => state.error
);

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: SharedUsersState) => selectAll(state)
);

export const selectUsersEntities = createSelector(
  selectUsersState,
  (state: SharedUsersState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectUsersState,
  (state: SharedUsersState) => state.selectedId
);

export const selectEntity = createSelector(
  selectUsersEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
