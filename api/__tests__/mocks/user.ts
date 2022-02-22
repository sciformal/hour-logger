import { v4 as uuid } from 'uuid';
import { UserDTO, AdminType, UserType } from '../../src/types/database/User';
import { UserRequest } from '../../src/types/interface/User';

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

export const sampleUser: UserDTO = {
  ...sampleUserRequest,
  hours: 0,
  finalHours: 0,
  regularHoursNeeded: 8,
  finalHoursNeeded: 10,
  adminType: AdminType.USER,
  isCheckedIn: false,
  transactions: [],
};
