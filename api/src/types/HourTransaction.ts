/**
 * DynamoDB Hour Transaction Model.
 */
export interface HourTransaction {
    date: string,
    checkIn: string,
    checkOut: string,
    checkInTime: string,
    checkOutTime: string,
    hours: string,
    notes?: string
}