import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as SharedUsersActions from './users.actions';
import * as SharedUsersFeature from './users.reducer';
import * as SharedUsersSelectors from './users.selectors';

@Injectable()
export class SharedUsersFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(SharedUsersSelectors.selectUsersLoaded));
  allUsers$ = this.store.pipe(select(SharedUsersSelectors.selectAllUsers));
  selectedUsers$ = this.store.pipe(select(SharedUsersSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(SharedUsersActions.initUsers());
  }
}
