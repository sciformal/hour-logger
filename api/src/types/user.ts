import { HourTransaction } from './HourTransaction';

/**
 * DynamoDB user model.
 */
export interface User {
    userId: string,
    email: string,
    studentNumber: string,
    firstName: string,
    lastName: string,
    hours: number,
    hoursNeeded: number,
    isCheckedIn: boolean,
    type: UserType,
    transactions: Array<HourTransaction>,
}

/** 
 * Allowed user types.
 */
export enum UserType {
    USER = "USER",
    MANAGER = "MANAGER",
    BOUNCER = "BOUNCER",
    ADMIN = "ADMIN",
}