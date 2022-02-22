import { RequestStatus, RequestType } from '../database/Request';

/**
 * Request object for creating requests.
 */
export interface BaseRequest {
  userId: string;
  message: string;
  type: RequestType;
}

/**
 * Request object for creating transfer requests.
 */
export interface TransferRequest extends BaseRequest {
  toUserId: string;
}

/**
 * Request object for updating requests.
 */
export interface UpdateRequest {
  requestId: string; // this gets updated by the validator
  status: RequestStatus;
  numHours: number;
}
