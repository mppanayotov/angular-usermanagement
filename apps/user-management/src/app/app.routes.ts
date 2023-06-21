import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/user-list', pathMatch: 'full' },
  {
    path: 'user-list',
    loadChildren: () =>
      import('@angular-usermanagement/user-list/user-list-page').then(
        (module) => module.UserListUserListPageModule
      ),
  },
  {
    path: 'user/:id',
    loadChildren: () =>
      import('@angular-usermanagement/user-setup/user-setup-page').then(
        (module) => module.UserSetupUserSetupPageModule
      ),
  },
];
