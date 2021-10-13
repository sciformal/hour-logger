import { HourTransaction } from './../HourTransaction';

/**
 * Hours Request Object for updating hours
 */
 export interface UpdateHoursRequest extends HourTransaction {
    studentNumber: string,
}