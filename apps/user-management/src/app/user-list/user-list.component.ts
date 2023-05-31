import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { Store } from '@ngrx/store';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';
import { selectAllUsers } from '@angular-usermanagement/shared/users';
import * as SharedUsersActions from '@angular-usermanagement/shared/users';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'angular-usermanagement-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements AfterViewInit {
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
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.table('Add dialog was closed. Add result:', result ?? 'cancel');
      result && this.onAdd(result);
    });
  }

  openDeleteDialog(row: UserListComponent): void {
    const dialogRef = this.dialog.open(DialogDeleteUserComponent, {
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
    const newUser: SharedUsersEntity = {
      ...addDialogResult,
      id: this.genId(),
      status: 'active',
      superadmin: true,
      permissions: {
        'Permission group 1': {
          'Permission 11': true,
          'Permission 12': false,
          'Permission 13': false,
          'Permission 14': false,
          'Permission 15': false,
        },
        'Permission group 2': {
          'Permission 21': true,
          'Permission 22': true,
          'Permission 23': true,
          'Permission 24': true,
          'Permission 25': true,
        },
        'Permission group 3': {
          'Permission 31': false,
          'Permission 32': false,
          'Permission 33': false,
          'Permission 34': false,
          'Permission 35': false,
        },
      },
    };

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
