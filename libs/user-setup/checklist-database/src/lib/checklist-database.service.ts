import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedUsersEntity } from '@angular-usermanagement/shared/users';

/**
 * Node for permission item
 */
class PermissionItemNode {
  children: PermissionItemNode[] = [];
  item = '';
  isChecked?: boolean;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a permission item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class UserSetupChecklistDatabaseService {
  dataChange = new BehaviorSubject<PermissionItemNode[]>([]);

  get data(): PermissionItemNode[] {
    return this.dataChange.value;
  }

  initialize(treeData: SharedUsersEntity['permissions']) {
    // Build the tree nodes from Json object. The result is a list of `PermissionItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(treeData, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `PermissonItemNode`.
   */
  buildFileTree(
    obj: { [key: string]: any },
    level: number
  ): PermissionItemNode[] {
    return Object.keys(obj).reduce<PermissionItemNode[]>((accumulator, key) => {
      const value = obj[key];

      const node = new PermissionItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.isChecked = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}
