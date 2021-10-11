import { GlobalConstants } from "../../src/constants/global";
import { UserRequest } from "../../src/types/requests/UserRequest";
import { User, UserType } from "../../src/types/User";
import { v4 as uuid } from "uuid";

export const sampleUserId = uuid();

export const sampleStudentNumber = "99999999";

export const sampleUserRequest: UserRequest = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@queensu.ca",
  studentNumber: sampleStudentNumber,
  userId: sampleUserId,
};

export const sampleUser: User = {
    ...sampleUserRequest,
    hours: 0,
    hoursNeeded: GlobalConstants.HOURS_NEEDED,
    type: UserType.USER,
    isCheckedIn: false,
    transactions: [],
  };