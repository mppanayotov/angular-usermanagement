import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { UserSetupChecklistDatabaseService } from '@angular-usermanagement/user-setup/checklist-database';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';
import { selectAllUsers } from '@angular-usermanagement/shared/users';
import * as SharedUsersActions from '@angular-usermanagement/shared/users';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

/**
 * Node for permission item
 */
export class PermissionItemNode {
  children: PermissionItemNode[] = [];
  item = '';
  isChecked?: boolean;
}

/** Flat permission item node with expandable and level information */
export class PermissionItemFlatNode {
  item = '';
  level = 0;
  expandable = false;
  isChecked?: boolean;
}

export interface PatchPermissionEntry {
  name: string;
  value: boolean;
}

@Component({
  selector: 'angular-usermanagement-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
})
export class UserSetupComponent implements OnInit {
  users$ = this.store.select(selectAllUsers);
  users: SharedUsersEntity[] = [];
  user?: SharedUsersEntity;
  updatedUser?: SharedUsersEntity;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<PermissionItemFlatNode, PermissionItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<PermissionItemNode, PermissionItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: PermissionItemFlatNode | null = null;

  /** The new item's name */
  treeControl: FlatTreeControl<PermissionItemFlatNode>;
  treeFlattener: MatTreeFlattener<PermissionItemNode, PermissionItemFlatNode>;
  dataSource: MatTreeFlatDataSource<PermissionItemNode, PermissionItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<PermissionItemFlatNode>(
    true /* multiple */
  );

  form = this.formBuilder.group({
    firstName: [this.updatedUser?.firstName, Validators.required],
    lastName: [this.updatedUser?.lastName, Validators.required],
    email: [this.updatedUser?.email, [Validators.required, Validators.email]],
    role: [this.updatedUser?.role, Validators.required],
  });

  roles = ['user', 'admin'];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
    private _database: UserSetupChecklistDatabaseService,
    private formBuilder: FormBuilder
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<PermissionItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    this.setUser();
  }

  setUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.users$.subscribe((users) => {
      this.users = users;
      this.user = this.updatedUser = users.find((user) => user.id == id);
      this.user && this._database.initialize(this.user?.permissions);
      this.form = this.formBuilder.group({
        firstName: [this.updatedUser?.firstName, Validators.required],
        lastName: [this.updatedUser?.lastName, Validators.required],
        email: [
          this.updatedUser?.email,
          [Validators.required, Validators.email],
        ],
        role: [this.updatedUser?.role, Validators.required],
      });
      this.checklistSelection = new SelectionModel<PermissionItemFlatNode>(
        true,
        this.treeControl.dataNodes.filter((node) => node.isChecked)
      );
    });
  }

  // Update store values with new
  saveAndGoBack(): void {
    if (
      this.updatedUser &&
      this.form.value.firstName &&
      this.form.value.lastName &&
      this.form.value.email &&
      this.form.value.role
    ) {
      this.updatedUser = {
        ...this.updatedUser,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        role: this.form.value.role,
      };

      this.store.dispatch(
        SharedUsersActions.updateUser({ user: this.updatedUser })
      );
    }
    this.location.back();
  }

  // Patch new user object with values from slide toggles
  onStatusChange($event: MatSlideToggleChange) {
    if (this.updatedUser) {
      this.updatedUser = {
        ...this.updatedUser,
        status: $event.checked ? 'active' : 'disabled',
      };
    }
  }

  // Patch new user object with values from slide toggles
  onSuperadminChange($event: MatCheckboxChange) {
    if (this.updatedUser) {
      this.updatedUser = {
        ...this.updatedUser,
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

  // Patch new user object with values from checkboxes
  patchCheckboxes(patchParent: string, patchChild: PatchPermissionEntry): void {
    if (this.updatedUser) {
      this.updatedUser = {
        ...this.updatedUser,
        permissions: {
          ...this.updatedUser.permissions,
          [patchParent]: {
            ...this.updatedUser.permissions[patchParent],
            [patchChild.name]: patchChild.value,
          },
        },
      };
    }
  }

  getLevel = (node: PermissionItemFlatNode) => node.level;
  isExpandable = (node: PermissionItemFlatNode) => node.expandable;
  getChildren = (node: PermissionItemNode): PermissionItemNode[] =>
    node.children;
  hasChild = (_: number, _nodeData: PermissionItemFlatNode) =>
    _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: PermissionItemFlatNode) =>
    _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: PermissionItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new PermissionItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.isChecked = node.isChecked;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: PermissionItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    descAllSelected && this.checklistSelection.select(node);
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: PermissionItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the permission item selection. Select/deselect all the descendants node */
  permissionItemSelectionToggle(node: PermissionItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(child);
      child.isChecked = this.checklistSelection.isSelected(child);

      if (this.updatedUser && node.expandable) {
        const patchParent = [node.item].toString();
        const patchChild: PatchPermissionEntry = {
          name: child.item,
          value: child.isChecked,
        };
        this.patchCheckboxes(patchParent, patchChild);
      }
    });
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf permission item selection. Check all the parents to see if they changed */
  permissionLeafItemSelectionToggle(node: PermissionItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    node.isChecked = this.checklistSelection.isSelected(node);

    if (this.updatedUser && !node.expandable && this.getParentNode(node)) {
      const patchParent = [this.getParentNode(node)?.item].toString();
      const patchChild: PatchPermissionEntry = {
        name: node.item,
        value: node.isChecked,
      };
      this.patchCheckboxes(patchParent, patchChild);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: PermissionItemFlatNode): void {
    let parent: PermissionItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: PermissionItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: PermissionItemFlatNode): PermissionItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
