import { v4 as uuid } from 'uuid';
import {
  RequestDTO,
  RequestStatus,
  RequestType,
} from '../../src/types/database/Request';
import { sampleUserId } from './user';

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
  requestId: uuid(),
  status: RequestStatus.PENDING,
  date: 'today',
};

export const sampleReductionRequestResopnse = {
  ...sampleReductionRequestDTO,
};
