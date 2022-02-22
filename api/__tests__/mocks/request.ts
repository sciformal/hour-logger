import { v4 as uuid } from 'uuid';
import {
  RequestDTO,
  RequestStatus,
  RequestType,
} from '../../src/types/database/Request';
import { sampleUserId } from './user';

export const sampleToUserId = uuid();
export const sampleReductionRequestId = uuid();
export const sampleTransferRequestId = uuid();

/**
 * Sample request body for a reduction request.
 */
export const sampleReductionRequestBody = {
  userId: sampleUserId,
  message: 'Please reduce my hours!',
  type: RequestType.REDUCTION,
};

/**
 * Sample request object in the database.
 */
export const sampleReductionRequestDTO: RequestDTO = {
  ...sampleReductionRequestBody,
  requestId: sampleReductionRequestId,
  status: RequestStatus.PENDING,
  date: 'today',
};

export const sampleReductionRequestResponse = {
  ...sampleReductionRequestDTO,
};

/**
 * Sample request body for a reduction request.
 */
export const sampleTransferRequestBody = {
  userId: sampleUserId,
  toUserId: sampleToUserId,
  message: 'Please reduce my hours!',
  type: RequestType.TRANSFER,
};

/**
 * Sample request object in the database.
 */
export const sampleTransferRequestDTO: RequestDTO = {
  ...sampleTransferRequestBody,
  requestId: sampleTransferRequestId,
  status: RequestStatus.PENDING,
  date: 'today',
};

export const sampleTransferRequestResponse = {
  ...sampleTransferRequestDTO,
};
