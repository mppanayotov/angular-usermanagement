import { Action } from '@ngrx/store';

import * as SharedUsersActions from './users.actions';
import { SharedUsersEntity } from './users.models';
import {
  SharedUsersState,
  initialUsersState,
  usersReducer,
} from './users.reducer';

describe('SharedUsers Reducer', () => {
  const createUsersEntity = (id: string, name = ''): SharedUsersEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid SharedUsers actions', () => {
    it('loadUsersSuccess should return the list of known SharedUsers', () => {
      const users = [
        createUsersEntity('PRODUCT-AAA'),
        createUsersEntity('PRODUCT-zzz'),
      ];
      const action = SharedUsersActions.loadUsersSuccess({ users });

      const result: SharedUsersState = usersReducer(initialUsersState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = usersReducer(initialUsersState, action);

      expect(result).toBe(initialUsersState);
    });
  });
});
