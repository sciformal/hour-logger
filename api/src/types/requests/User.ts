import { UserSituation } from '../database/UserType';

/**
 * User Request Object for creating users.
 */
export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  userId: string;
  userType: UserSituation;
}