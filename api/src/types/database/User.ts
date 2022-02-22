/**
 * DynamoDB user model.
 */
export interface UserDTO {
  userId: string;
  email: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  hours: number;
  regularHoursNeeded: number;
  finalHours: number;
  finalHoursNeeded: number;
  isCheckedIn: boolean;
  transactions: Array<HourTransaction>;
  adminType: AdminType;
  userType: UserType;
}

/**
 * Allowed user types.
 */
export enum AdminType {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

/**
 * Allowed guest types.
 */
export enum UserType {
  ENGINEER_ENROLLED = 'ENGINEER_ENROLLED',
  INTERNSHIP_KTOWN = 'INTERNSHIP_KTOWN',
  INTERNSHIP = 'INTERNSHIP',
  GUEST_QUEENS = 'GUEST_QUEENS',
  GUEST = 'GUEST',
  SCIFORMAL = 'SCIFORMAL',
}

/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
  checkIn: string;
  checkOut: string;
  hours: number;
  notes?: string;
}
