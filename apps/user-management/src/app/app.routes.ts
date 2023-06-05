import { Route } from '@angular/router';
import { UserSetupComponent } from './user-setup/user-setup.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/user-list', pathMatch: 'full' },
  {
    path: 'user-list',
    loadChildren: () =>
      import('@angular-usermanagement/user-list/user-list-page').then(
        (module) => module.UserListUserListPageModule
      ),
  },
  { path: 'user/:id', component: UserSetupComponent },
];
