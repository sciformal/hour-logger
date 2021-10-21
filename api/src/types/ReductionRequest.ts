/**
 * DynamoDB user model.
 */
export enum ReductionStatus {
        PENDING, APPROVED, DENIED
}
export interface ReductionRequest {
    requestID: string,
    userID: string, 
    message: string,
    status: ReductionStatus
}