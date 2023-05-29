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
  superadmin: boolean;
  permissions: {
    [permissionGroupName: string]: {
      [permission: string]: boolean;
    };
  };
}
