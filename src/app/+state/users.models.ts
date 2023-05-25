/**
 * Interface for the 'Users' data
 */
export interface UsersEntity {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  email: string;
  permissions: [{ superadmin: string; value: string }];
}
