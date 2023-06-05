import { Component, Inject } from '@angular/core';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'angular-usermanagement-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.scss'],
})
export class DialogDeleteUserComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SharedUsersEntity
  ) {}
}
