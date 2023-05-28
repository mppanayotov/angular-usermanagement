/**
 * Interface for the 'SharedUsers' data
 */
export interface SharedUsersEntity {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  email: string;
  permissions: {
    superadmin: boolean;
    permissionGroupName: string;
    permissionGroupPermissions: {
      permission: string;
      value: null | string;
    };
  };
}
