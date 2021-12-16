import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorConstants } from '../../src/constants/errors';
import { create, get, update } from '../../src/handlers/requests';
import { RequestStatus } from '../../src/types/database/ReductionRequest';
import { Request, UpdateRequest } from '../../src/types/requests/Request';
import { DynamoUtilities } from '../../src/util/dynamo-utilities';
import { sampleApiGatewayEvent } from '../mocks/event';
import {
  sampleReductionRequest,
  sampleReductionRequestDTO,
} from '../mocks/request';
import { sampleUser } from '../mocks/user';

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
  describe('Create Request', () => {
    let validRequest: Partial<Request>;
    beforeEach(() => {
      validRequest = {
        ...sampleReductionRequestDTO,
      };

      jest
        .spyOn(DynamoUtilities, 'put')
        .mockResolvedValue(sampleReductionRequest);
      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(sampleUser);
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
        JSON.stringify({
          message: ErrorConstants.createValidationString('userId'),
        }),
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
          message: ErrorConstants.createValidationString('message'),
        }),
      );
    });

    it('should return 400 when the user making the request doesnt exist in the users table', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(null);

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.DYNAMO_USERID_NOT_FOUND,
        }),
      );
    });

    it('should return 500 when Dynamo fails to pull the user', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const sampleErrorMessage = 'sample error message';

      jest
        .spyOn(DynamoUtilities, 'get')
        .mockRejectedValue(new Error(sampleErrorMessage));

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: sampleErrorMessage,
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

  describe('Get Requests', () => {
    it('should return a 200 when getting a request successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      jest
        .spyOn(DynamoUtilities, 'scan')
        .mockResolvedValue([sampleReductionRequest]);

      const response = await get(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify([sampleReductionRequest]));
    });

    it('should return 500 when Dynamo fails', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const sampleErrorMessage = 'sample error message';

      jest
        .spyOn(DynamoUtilities, 'scan')
        .mockRejectedValue(new Error(sampleErrorMessage));

      const response = await get(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: sampleErrorMessage,
        }),
      );
    });
  });

  describe('Update Requests', () => {
    let validRequest: Partial<UpdateRequest>;
    beforeEach(() => {
      validRequest = {
        status: RequestStatus.APPROVED,
        numHours: 10,
      };

      jest.spyOn(DynamoUtilities, 'put').mockImplementation(
        async params =>
          new Promise((resolve, reject) => {
            if (params.TableName === process.env.reductionRequestsTable) {
              resolve(sampleReductionRequest);
            } else {
              resolve(sampleUser);
            }
          }),
      );
      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(sampleUser);
    });

    it('should return a 200 and update the request to denied when denied', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          requestId: sampleReductionRequest.requestId,
        },
        body: JSON.stringify({
          status: RequestStatus.DENIED,
        }),
      };

      const response = await update(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleReductionRequest));
    });

    it('should return a 200 and update the user and request when approved', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          requestId: sampleReductionRequest.requestId,
        },
        body: JSON.stringify({
          status: RequestStatus.APPROVED,
          numHours: 10,
        }),
      };

      const response = await update(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleReductionRequest));
    });

    // Test that the reqeustId is in the path parameters
    it('should return 400 when the request is missing the path parameters', async () => {
      // path parameter is null by default anyways.
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify({
          status: RequestStatus.APPROVED,
          numHoursReduced: 10,
        }),
      };

      const response = await update(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.VALIDATION_PATH_MISSING,
        }),
      );
    });

    it('should return 400 when the request doesnt contain a body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: null,
        pathParameters: {
          requestId: sampleReductionRequest.requestId,
        },
      };

      const response = await update(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.VALIDATION_BODY_MISSING,
        }),
      );
    });

    it('should return 400 when the request contains an invalid body', async () => {});

    it('should return 400 when the request doesnt contain a status', async () => {});

    it('should return 400 when the request contains an invalid status', async () => {});

    it('should return 400 when the request is APPROVED but doesnt contain numHoursReduced', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          requestId: sampleReductionRequest.requestId,
        },
        body: JSON.stringify({
          status: RequestStatus.APPROVED,
        }),
      };

      const response = await update(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('numHours'),
        }),
      );
    });

    it('should return 500 when getting the request from dynamo fails', async () => {});

    it('should return 500 when getting the user from dynamo fails', async () => {});

    it('should return 500 when updating the request fails denied', async () => {});

    it('should return 500 when updating the request fails approved', async () => {});

    it('should return 500 when updating the user fails', async () => {});
  });
});
