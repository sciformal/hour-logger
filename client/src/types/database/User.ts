import { HourTransaction, HourRequest } from './HourTransaction';
import { UserSituation, UserType } from './UserType';

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
  type: UserType;
  userType: UserSituation;
  transactions: Array<HourTransaction>;
  requests: Array<HourRequest>;
}
