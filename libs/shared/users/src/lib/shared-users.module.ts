import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './+state/users/users.reducer';
import { SharedUsersEffects } from './+state/users/users.effects';
import { SharedUsersFacade } from './+state/users/users.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.usersReducer),
    EffectsModule.forFeature([SharedUsersEffects]),
  ],
  providers: [SharedUsersFacade],
})
export class SharedUsersModule {}
