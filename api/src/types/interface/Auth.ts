import { UserType } from '../database/User';

export interface UserValidationRequest {
  studentNumber: string;
  userType: UserType;
}
