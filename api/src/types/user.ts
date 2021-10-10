import { HourTransaction } from './hour-transaction';

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

export enum UserType {
    USER = "USER",
    MANAGER = "MANAGER",
    BOUNCER = "BOUNCER",
    ADMIN = "ADMIN",
}