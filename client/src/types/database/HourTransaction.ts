/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
  checkIn: string;
  checkOut: string;
  notes?: string;
}

/**
 * DynamoDB Request Model.
 */
export interface HourRequest {
  type: string;
  status: string;
}
