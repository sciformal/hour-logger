import { HourTransaction } from '../database/HourTransaction';

/**
 * Hours Request Object for updating hours
 */
export interface UpdateHoursRequest extends HourTransaction {
  studentNumber: string;
}
