import { SharedUsersEntity } from './users.models';
import {
  usersAdapter,
  SharedUsersPartialState,
  initialUsersState,
} from './users.reducer';
import * as SharedUsersSelectors from './users.selectors';

describe('SharedUsers Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getUsersId = (it: SharedUsersEntity) => it.id;
  const createUsersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as SharedUsersEntity);

  let state: SharedUsersPartialState;

  beforeEach(() => {
    state = {
      users: usersAdapter.setAll(
        [
          createUsersEntity('PRODUCT-AAA'),
          createUsersEntity('PRODUCT-BBB'),
          createUsersEntity('PRODUCT-CCC'),
        ],
        {
          ...initialUsersState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('SharedUsers Selectors', () => {
    it('selectAllUsers() should return the list of SharedUsers', () => {
      const results = SharedUsersSelectors.selectAllUsers(state);
      const selId = getUsersId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = SharedUsersSelectors.selectEntity(
        state
      ) as SharedUsersEntity;
      const selId = getUsersId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectUsersLoaded() should return the current "loaded" status', () => {
      const result = SharedUsersSelectors.selectUsersLoaded(state);

      expect(result).toBe(true);
    });

    it('selectUsersError() should return the current "error" state', () => {
      const result = SharedUsersSelectors.selectUsersError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
