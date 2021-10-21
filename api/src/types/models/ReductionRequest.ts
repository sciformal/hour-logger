/**
 * DynamoDB user model.
 */
export enum ReductionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export interface ReductionRequest {
  requestId: string;
  userId: string;
  message: string;
  status: ReductionStatus;
}
