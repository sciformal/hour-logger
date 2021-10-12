/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
    checkIn: string,
    checkOut: string,
    notes?: string
}