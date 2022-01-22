import { HourTransaction } from './HourTransaction';
import { AdminType, UserType } from './UserType';

/**
 * DynamoDB user model.
 */
export interface User {
  userId: string;
  email: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  hours: number;
  finalHours: number;
  finalHoursNeeded: number;
  regularHoursNeeded: number;
  isCheckedIn: boolean;
  transactions: Array<HourTransaction>;
  adminType: AdminType;
  userType: UserType;
}
