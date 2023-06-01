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
import { UserListComponent } from './user-list/user-list.component';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { SharedUsersModule } from '@angular-usermanagement/shared/users';
import { UserSetupChecklistDatabaseModule } from '@angular-usermanagement/user-setup/checklist-database';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from './dialog-delete-user/dialog-delete-user.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserSetupComponent,
    DialogAddUserComponent,
    DialogDeleteUserComponent,
  ],
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
    UserSetupChecklistDatabaseModule,
  ],
  providers: [UsersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
