import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTreeFlatDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { UserSetupChecklistDatabaseService } from '@angular-usermanagement/user-setup/checklist-database';
import { UserSetupChecklistTreeService } from '@angular-usermanagement/user-setup/checklist-tree';
import {
  PermissionItemNode,
  PermissionItemFlatNode,
} from '@angular-usermanagement/user-setup/checklist-models';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';
import { selectAllUsers } from '@angular-usermanagement/shared/users';
import * as SharedUsersActions from '@angular-usermanagement/shared/users';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'angular-usermanagement-user-setup-page',
  templateUrl: './user-setup-page.component.html',
  styleUrls: ['./user-setup-page.component.scss'],
})
export class UserSetupPageComponent implements OnInit {
  users$ = this.store.select(selectAllUsers);
  user?: SharedUsersEntity;
  dataSource: MatTreeFlatDataSource<PermissionItemNode, PermissionItemFlatNode>;

  form = this.formBuilder.group({
    firstName: [this.user?.firstName, Validators.required],
    lastName: [this.user?.lastName, Validators.required],
    email: [this.user?.email, [Validators.required, Validators.email]],
    role: [this.user?.role, Validators.required],
  });

  roles = ['user', 'admin'];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
    private checklistDatabase: UserSetupChecklistDatabaseService,
    private formBuilder: FormBuilder,
    public checklistTree: UserSetupChecklistTreeService
  ) {
    this.dataSource = new MatTreeFlatDataSource(
      checklistTree.treeControl,
      checklistTree.treeFlattener
    );

    checklistDatabase.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    this.setUser();
  }

  setUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.users$.subscribe((users) => {
      this.user = this.checklistTree.updatedUser = users.find(
        (user) => user.id == id
      );
      this.user && this.checklistDatabase.initialize(this.user.permissions);
      this.form = this.formBuilder.group({
        firstName: [this.user?.firstName, Validators.required],
        lastName: [this.user?.lastName, Validators.required],
        email: [this.user?.email, [Validators.required, Validators.email]],
        role: [this.user?.role, Validators.required],
      });

      this.checklistTree.checklistSelection =
        new SelectionModel<PermissionItemFlatNode>(
          true,
          this.checklistTree.treeControl.dataNodes.filter(
            (node) => node.isChecked
          )
        );
    });
  }

  // Update store values with new
  saveAndGoBack(): void {
    if (
      this.user &&
      this.checklistTree.updatedUser &&
      this.form.value.firstName &&
      this.form.value.lastName &&
      this.form.value.email &&
      this.form.value.role
    ) {
      this.user = {
        ...this.user,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        role: this.form.value.role,
        permissions: {
          ...this.checklistTree.updatedUser.permissions,
        },
      };

      this.store.dispatch(SharedUsersActions.updateUser({ user: this.user }));
    }
    this.location.back();
  }

  // Patch new user object with values from slide toggles
  onStatusChange($event: MatSlideToggleChange) {
    if (this.user) {
      this.user = {
        ...this.user,
        status: $event.checked ? 'active' : 'disabled',
      };
    }
  }

  // Patch new user object with values from slide toggles
  onSuperadminChange($event: MatCheckboxChange) {
    if (this.user) {
      this.user = {
        ...this.user,
        superadmin: $event.checked,
      };
    }
  }

  // Determine the error message for form fields
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
