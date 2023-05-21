import { AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';

export interface UserListItem {
  name: string;
  id: number;
  role: string;
  status: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: UserListItem[] = [
  { id: 1, name: 'Hydrogen', role: 'admin', status: 'active' },
  { id: 2, name: 'Helium', role: 'user', status: 'disabled' },
  { id: 3, name: 'Lithium', role: 'admin', status: 'disabled' },
  { id: 4, name: 'Beryllium', role: 'user', status: 'active' },
  { id: 5, name: 'Boron', role: 'user', status: 'active' },
  { id: 6, name: 'Carbon', role: 'user', status: 'active' },
  { id: 7, name: 'Nitrogen', role: 'user', status: 'active' },
  { id: 8, name: 'Oxygen', role: 'user', status: 'active' },
  { id: 9, name: 'Fluorine', role: 'user', status: 'active' },
  { id: 10, name: 'Neon', role: 'user', status: 'active' },
  { id: 11, name: 'Sodium', role: 'user', status: 'active' },
  { id: 12, name: 'Magnesium', role: 'user', status: 'active' },
  { id: 13, name: 'Aluminum', role: 'user', status: 'active' },
  { id: 14, name: 'Silicon', role: 'user', status: 'active' },
  { id: 15, name: 'Phosphorus', role: 'user', status: 'active' },
  { id: 16, name: 'Sulfur', role: 'user', status: 'active' },
  { id: 17, name: 'Chlorine', role: 'user', status: 'active' },
  { id: 18, name: 'Argon', role: 'user', status: 'active' },
  { id: 19, name: 'Potassium', role: 'user', status: 'active' },
  { id: 20, name: 'Calcium', role: 'user', status: 'active' },
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<UserListItem> = new MatTableDataSource(
    EXAMPLE_DATA
  );
  addDialogResult: string = '';
  deleteDialogResult?: UserListComponent;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'name', 'role', 'status', 'actions'];

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      data: { sendToDialog: 'send to dialog' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log('Result: ' + result);
      this.addDialogResult = result;
    });
  }

  openDeleteDialog(row: UserListComponent): void {
    console.log(row);

    const dialogRef = this.dialog.open(DialogDeleteUserComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result: UserListComponent) => {
      console.log('The dialog was closed');
      console.log('Result: ' + result);
      this.deleteDialogResult = result;
    });
  }
}
