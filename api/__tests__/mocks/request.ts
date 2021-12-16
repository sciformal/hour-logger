import { v4 as uuid } from 'uuid';
import {
  RequestModel,
  RequestStatus,
} from '../../src/types/database/ReductionRequest';
import { RequestType } from '../../src/types/requests/Request';
import { sampleUserId } from './user';

export const sampleReductionRequestDTO = {
  userId: sampleUserId,
  message: 'Please reduce my hours!',
  type: RequestType.REDUCTION,
};

export const sampleReductionRequest: RequestModel = {
  ...sampleReductionRequestDTO,
  requestId: uuid(),
  status: RequestStatus.PENDING,
};
