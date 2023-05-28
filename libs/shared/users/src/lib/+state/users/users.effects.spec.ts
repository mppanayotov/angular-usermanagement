import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as SharedUsersActions from './users.actions';
import { SharedUsersEffects } from './users.effects';

describe('SharedUsersEffects', () => {
  let actions: Observable<Action>;
  let effects: SharedUsersEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SharedUsersEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(SharedUsersEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: SharedUsersActions.initUsers() });

      const expected = hot('-a-|', {
        a: SharedUsersActions.loadUsersSuccess({ users: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
