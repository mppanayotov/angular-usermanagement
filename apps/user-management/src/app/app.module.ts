import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UsersService } from './users.service';
// import { UserListComponent } from './user-list/user-list.component';
import { UserListUserListPageModule } from '@angular-usermanagement/user-list/user-list-page';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { SharedUsersModule } from '@angular-usermanagement/shared/users';
import { SharedStylesModule } from '@angular-usermanagement/shared/styles';
import { UserSetupChecklistDatabaseModule } from '@angular-usermanagement/user-setup/checklist-database';
import { UserSetupChecklistTreeModule } from '@angular-usermanagement/user-setup/checklist-tree';
import { UserSetupChecklistModelsModule } from '@angular-usermanagement/user-setup/checklist-models';

@NgModule({
  declarations: [AppComponent, UserSetupComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTreeModule,
    MatCheckboxModule,
    SharedUsersModule,
    UserListUserListPageModule,
    UserSetupChecklistDatabaseModule,
    UserSetupChecklistTreeModule,
    UserSetupChecklistModelsModule,
    SharedStylesModule,
  ],
  providers: [UsersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
