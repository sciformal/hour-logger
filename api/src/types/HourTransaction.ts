/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
    date: string,
    checkIn: string,
    checkOut: string,
    hours: string,
    notes?: string
}