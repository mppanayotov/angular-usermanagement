import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as SharedUsersActions from './users.actions';
import { SharedUsersEffects } from './users.effects';
import { SharedUsersFacade } from './users.facade';
import { SharedUsersEntity } from './users.models';
import {
  USERS_FEATURE_KEY,
  SharedUsersState,
  initialUsersState,
  usersReducer,
} from './users.reducer';
import * as SharedUsersSelectors from './users.selectors';

interface TestSchema {
  users: SharedUsersState;
}

describe('SharedUsersFacade', () => {
  let facade: SharedUsersFacade;
  let store: Store<TestSchema>;
  const createUsersEntity = (id: string, name = ''): SharedUsersEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
          EffectsModule.forFeature([SharedUsersEffects]),
        ],
        providers: [SharedUsersFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(SharedUsersFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allUsers$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allUsers$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadUsersSuccess` to manually update list
     */
    it('allUsers$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allUsers$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        SharedUsersActions.loadUsersSuccess({
          users: [createUsersEntity('AAA'), createUsersEntity('BBB')],
        })
      );

      list = await readFirst(facade.allUsers$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
