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

@Component({
  selector: 'angular-usermanagement-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users$ = this.store.select(selectAllUsers);
  dataSource: MatTableDataSource<SharedUsersEntity> = new MatTableDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'name', 'role', 'status', 'actions'];

  constructor(private store: Store, public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.users$.subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
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

  // onAdd(userId: string) {
  //   this.store.dispatch(SharedUsersActions.addUser({ userId }));
  // }

  onRemove(userId: string) {
    this.store.dispatch(SharedUsersActions.removeUser({ userId }));
  }
}
