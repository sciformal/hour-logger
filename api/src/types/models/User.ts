import { HourTransaction } from './HourTransaction';
import { UserType } from './UserType';

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
  hoursNeeded: number;
  isCheckedIn: boolean;
  type: UserType;
  transactions: Array<HourTransaction>;
}
