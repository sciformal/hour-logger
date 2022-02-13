/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
  checkIn: string;
  checkOut: string;
  hours: number;
  notes?: string;
}
