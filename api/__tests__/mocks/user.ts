import { UserSituation } from '../../src/types/requests/UserRequest';
import { v4 as uuid } from 'uuid';
import { GlobalConstants } from '../../src/constants/global';
import { UserRequest } from '../../src/types/requests/UserRequest';
import { User } from '../../src/types/models/User';
import { UserType } from '../../src/types/models/UserType';

export const sampleUserId = uuid();

export const sampleStudentNumber = '99999999';

export const sampleUserRequest: UserRequest = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@queensu.ca',
  studentNumber: sampleStudentNumber,
  userId: sampleUserId,
  userSituation: UserSituation.ENGINEER_ENROLLED,
};

export const sampleUser: User = {
  ...sampleUserRequest,
  hours: 0,
  regularHoursNeeded: 8,
  finalHoursNeeded: 10,
  type: UserType.USER,
  isCheckedIn: false,
  transactions: [],
};
