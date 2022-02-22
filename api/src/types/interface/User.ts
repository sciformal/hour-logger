import { UserDTO, UserType } from '../database/User';

/**
 * User Request Object for creating users.
 */
export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  userId: string;
  userType: UserType;
}

export interface UserResponse extends UserDTO {}

export interface UsersResponse {
  items: Array<UserDTO>;
}
