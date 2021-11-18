/**
 * Allowed guest types.
 */
 export enum UserSituation {
  ENGINEER_ENROLLED = 'ENGINEER_ENROLLED',
  INTERNSHIP_KTOWN = 'INTERNSHIP_KTOWN',
  INTERNSHIP = 'INTERNSHIP',
  GUEST_QUEENS = 'GUEST_QUEENS',
  GUEST = 'GUEST',
  SCIFORMAL = 'SCIFORMAL',
}
/**
 * User Request Object for creating users.
 */
export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  userId: string;
  userSituation: UserSituation;
}
