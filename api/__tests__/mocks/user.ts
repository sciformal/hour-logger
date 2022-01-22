import { v4 as uuid } from 'uuid';
import { User } from '../../src/types/database/User';
import { AdminType, UserType } from '../../src/types/database/UserType';
import { UserRequest } from '../../src/types/requests/User';

export const sampleUserId = uuid();

export const sampleStudentNumber = '99999999';

export const sampleUserRequest: UserRequest = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@queensu.ca',
  studentNumber: sampleStudentNumber,
  userId: sampleUserId,
  userType: UserType.ENGINEER_ENROLLED,
};

export const sampleUser: User = {
  ...sampleUserRequest,
  hours: 0,
  finalHours: 0,
  regularHoursNeeded: 8,
  finalHoursNeeded: 10,
  adminType: AdminType.USER,
  isCheckedIn: false,
  transactions: [],
};
