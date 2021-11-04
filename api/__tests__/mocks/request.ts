import { v4 as uuid } from 'uuid';
import {
  ReductionRequest,
  ReductionStatus,
} from '../../src/types/models/ReductionRequest';
import { sampleUserId } from './user';

export const sampleReductionRequestDTO = {
  userId: sampleUserId,
  message: 'Please reduce my hours!',
  firstName: "John",
  lastName: "Doe"
};

export const sampleReductionRequest: ReductionRequest = {
  ...sampleReductionRequestDTO,
  requestId: uuid(),
  status: ReductionStatus.PENDING,
};
