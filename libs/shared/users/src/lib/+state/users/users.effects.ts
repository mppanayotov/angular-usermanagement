import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as SharedUsersActions from './users.actions';
import * as SharedUsersFeature from './users.reducer';

@Injectable()
export class SharedUsersEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedUsersActions.initUsers),
      switchMap(() => of(SharedUsersActions.loadUsersSuccess({ users: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(SharedUsersActions.loadUsersFailure({ error }));
      })
    )
  );
}
