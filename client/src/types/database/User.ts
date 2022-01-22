import { HourTransaction, HourRequest } from './HourTransaction';
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
  requests: Array<HourRequest>;
  adminType: AdminType;
  userType: UserType;
}
