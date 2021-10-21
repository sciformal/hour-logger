import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorConstants } from '../../src/constants/errors';
import { create } from '../../src/handlers/requests';
import { ReductionRequest } from '../../src/types/models/ReductionRequest';
import { DynamoUtilities } from '../../src/util/dynamo';
import { sampleApiGatewayEvent } from '../mocks/event';
import {
  sampleReductionRequest,
  sampleReductionRequestDTO,
} from '../mocks/request';

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn(),
      query: jest.fn(),
      get: jest.fn(),
    })),
  },
}));

describe('Requests API Tests', () => {
  describe('Create Reduction Request', () => {
    let validRequest: Partial<ReductionRequest>;
    beforeEach(() => {
      validRequest = {
        ...sampleReductionRequestDTO,
      };
      jest
        .spyOn(DynamoUtilities, 'put')
        .mockResolvedValue(sampleReductionRequest);
    });

    // return 200 when everything works
    it('should return a 200 when creating a request successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleReductionRequest));
    });

    it('should return 400 when the request doesnt contain a body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING }),
      );
    });

    it('should return 400 when the request contains an invalid body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: 'this cannot be parsed!',
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_INVALID }),
      );
    });

    it('should return 400 when the request body doesnt contain a userId', async () => {
      delete validRequest.userId;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_USERID }),
      );
    });

    it('should return 400 when the request body doesnt contain a reductionMessage', async () => {
      delete validRequest.message;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.VALIDATION_BODY_REDUCTION_REQUEST_MESSAGE,
        }),
      );
    });

    it('should return 500 when Dynamo fails to publish the request', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };
      const sampleErrorMessage = 'sample error message';

      jest
        .spyOn(DynamoUtilities, 'put')
        .mockRejectedValue(new Error(sampleErrorMessage));

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: sampleErrorMessage,
        }),
      );
    });
  });
});
