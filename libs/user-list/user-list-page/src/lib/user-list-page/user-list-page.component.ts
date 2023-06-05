import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserListDialogAddUserModule } from '@angular-usermanagement/user-list/dialog-add-user';
import { UserListDialogDeleteUserModule } from '@angular-usermanagement/user-list/dialog-delete-user';
import { Store } from '@ngrx/store';
import {
  SharedUsersEntity,
  newUserTemplate,
} from '@angular-usermanagement/shared/users';
import { selectAllUsers } from '@angular-usermanagement/shared/users';
import * as SharedUsersActions from '@angular-usermanagement/shared/users';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'angular-usermanagement-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss'],
})
export class UserListPageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users$ = this.store.select(selectAllUsers);
  users: SharedUsersEntity[] = [];
  dataSource: MatTableDataSource<SharedUsersEntity> = new MatTableDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['user', 'role', 'status', 'actions'];

  constructor(private store: Store, public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.users$.subscribe((users) => {
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sortingDataAccessor = (user, property) => {
        switch (property) {
          case 'user':
            return user.firstName;
          case 'role':
            return user.role;
          default:
            return user.status;
        }
      };
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserListDialogAddUserModule, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.table('Add dialog was closed. Add result:', result ?? 'cancel');
      result && this.onAdd(result);
    });
  }

  openDeleteDialog(row: UserListPageComponent): void {
    const dialogRef = this.dialog.open(UserListDialogDeleteUserModule, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.table(
        'Delete dialog was closed. Delete result:',
        result ?? 'cancel'
      );
      this.onRemove(result?.id);
    });
  }

  onStatusChange(row: SharedUsersEntity, $event: MatSlideToggleChange) {
    const updatedUser: SharedUsersEntity = {
      ...row,
      status: $event.checked ? 'active' : 'disabled',
    };

    this.store.dispatch(SharedUsersActions.updateUser({ user: updatedUser }));
  }

  onAdd(addDialogResult: SharedUsersEntity) {
    const newUser = new newUserTemplate(this.genId(), addDialogResult);
    this.store.dispatch(SharedUsersActions.addUser({ user: newUser }));
  }

  genId(): number {
    return this.users.length > 0
      ? Math.max(...this.users.map((user) => user.id)) + 1
      : 1;
  }

  onRemove(userId: string) {
    this.store.dispatch(SharedUsersActions.removeUser({ userId }));
  }
}
