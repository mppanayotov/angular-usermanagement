import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListPageComponent } from './user-list-page/user-list-page.component';

import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
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

@NgModule({
  declarations: [UserListPageComponent],
  imports: [
    CommonModule,
    EffectsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: UserListPageComponent,
      },
    ]),
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
  ],
})
export class UserListUserListPageModule {}
