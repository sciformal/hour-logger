/**
 * DynamoDB user model.
 */
export enum ReductionStatus {
  PENDING,
  APPROVED,
  DENIED,
}

export interface ReductionRequest {
  requestId: string;
  userId: string;
  message: string;
  status: ReductionStatus;
}
