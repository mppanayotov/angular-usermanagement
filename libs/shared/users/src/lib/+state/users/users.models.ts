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

/**
 * Class for the 'SharedUsers' data
 */
export class newUserTemplate implements SharedUsersEntity {
  id = 0;
  firstName = '';
  lastName = '';
  role = 'user';
  status = 'active';
  email = '';
  superadmin = false;
  permissions = {
    'Permission group 1': {
      'Permission 11': false,
      'Permission 12': false,
      'Permission 13': false,
      'Permission 14': false,
      'Permission 15': false,
    },
    'Permission group 2': {
      'Permission 21': false,
      'Permission 22': false,
      'Permission 23': false,
      'Permission 24': false,
      'Permission 25': false,
    },
    'Permission group 3': {
      'Permission 31': false,
      'Permission 32': false,
      'Permission 33': false,
      'Permission 34': false,
      'Permission 35': false,
    },
  };

  constructor(
    id: number,
    inputData: {
      firstName: string;
      lastName: string;
      role: string;
      email: string;
    }
  ) {
    this.id = id;
    this.firstName = inputData.firstName;
    this.lastName = inputData.lastName;
    this.role = inputData.role;
    this.email = inputData.email;
  }
}
