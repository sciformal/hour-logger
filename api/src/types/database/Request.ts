/**
 * Valid request types.
 */
export enum RequestType {
  REDUCTION = 'REDUCTION',
  TRANSFER = 'TRANSFER',
}

/**
 * Valid request statuses.
 */
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

/**
 * Base database object for requests.
 */
export interface RequestDTO {
  requestId: string;
  userId: string;
  message: string;
  status: RequestStatus;
  type: RequestType;
  date: string;
  numHours?: number;
}

export interface TransferRequestDTO extends RequestDTO {
  toUserId: string;
}

export interface ReductionRequestDTO extends RequestDTO {}
