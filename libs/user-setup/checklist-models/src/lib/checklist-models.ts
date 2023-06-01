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
/** Permission entry node for updating checklist items */
export interface PermissionEntry {
  name: string;
  value: boolean;
}
