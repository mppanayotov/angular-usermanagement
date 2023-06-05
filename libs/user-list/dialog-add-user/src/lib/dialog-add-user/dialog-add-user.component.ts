import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'angular-usermanagement-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss'],
})

export class DialogAddUserComponent {
  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
  });

  roles = ['user', 'admin'];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddUserComponent>
  ) {}

  getErrorMessage(field: FormControl) {
    if (field == this.form.controls.email) {
      if (this.form.controls.email.hasError('required')) {
        return 'You must enter a value';
      }

      return this.form.controls.email.hasError('email') && 'Not a valid email';
    }

    if (field.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }
}
