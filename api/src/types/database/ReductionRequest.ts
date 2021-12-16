/**
 * DynamoDB user model.
 */
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export interface RequestModel {
  requestId: string;
  userId: string;
  message: string;
  status: RequestStatus;
  numHoursReduced?: number;
  toUserId?: string;
}
