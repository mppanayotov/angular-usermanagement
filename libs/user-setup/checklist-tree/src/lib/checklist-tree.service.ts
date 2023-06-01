import { Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';
import {
  PermissionItemNode,
  PermissionItemFlatNode,
  PermissionEntry,
} from '@angular-usermanagement/user-setup/checklist-models';

@Injectable({
  providedIn: 'root',
})
export class UserSetupChecklistTreeService {
  updatedUser?: SharedUsersEntity;

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<PermissionItemNode, PermissionItemFlatNode>();

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<PermissionItemFlatNode, PermissionItemNode>();

  /** The selection for checklist */
  checklistSelection = new SelectionModel<PermissionItemFlatNode>(true);

  getLevel = (node: PermissionItemFlatNode) => node.level;
  isExpandable = (node: PermissionItemFlatNode) => node.expandable;
  getChildren = (node: PermissionItemNode): PermissionItemNode[] =>
    node.children;
  hasChild = (_: number, _nodeData: PermissionItemFlatNode) =>
    _nodeData.expandable;

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: PermissionItemFlatNode): void {
    let parent: PermissionItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
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

  /** The new item's name */
  treeFlattener: MatTreeFlattener<PermissionItemNode, PermissionItemFlatNode> =
    new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

  treeControl = new FlatTreeControl<PermissionItemFlatNode>(
    this.getLevel,
    this.isExpandable
  );

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

  // Patch new user object with values from checkboxes
  patchCheckboxes(patchParent: string, patchChild: PermissionEntry): void {
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
        const patchChild: PermissionEntry = {
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
      const patchChild: PermissionEntry = {
        name: node.item,
        value: node.isChecked,
      };
      this.patchCheckboxes(patchParent, patchChild);
    }
  }
}
