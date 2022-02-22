import { APIGatewayProxyEvent } from 'aws-lambda';
import { reject, resolve } from 'cypress/types/bluebird';
import { ErrorConstants } from '../../src/constants/errors';
import { create, get, update } from '../../src/handlers/requests';
import { RequestDTO, RequestStatus } from '../../src/types/database/Request';
import { UpdateRequest } from '../../src/types/interface/Request';
import { DynamoUtilities } from '../../src/util/dynamo-utilities';
import { sampleApiGatewayEvent } from '../mocks/event';
import {
  sampleReductionRequestId,
  sampleTransferRequestId,
  sampleReductionRequestBody,
  sampleReductionRequestDTO,
  sampleTransferRequestBody,
  sampleTransferRequestDTO,
} from '../mocks/request';
import { sampleUser, sampleUserId } from '../mocks/user';

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
    let validRequestBody: Partial<RequestDTO>;
    beforeEach(() => {
      validRequestBody = {
        ...sampleReductionRequestBody,
      };

      jest
        .spyOn(DynamoUtilities, 'put')
        .mockResolvedValue(sampleReductionRequestDTO);
      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(sampleUser);
    });

    // return 200 when everything works
    it('should return a 200 when creating a reduction request successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequestBody),
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleReductionRequestDTO));
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
      delete validRequestBody.userId;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequestBody),
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
      delete validRequestBody.message;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequestBody),
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
        body: JSON.stringify(validRequestBody),
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

    it('should return 400 when the toUserId missing on transfer request', async () => {
      const requestBody = {
        ...sampleTransferRequestBody,
        toUserId: null,
      };

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(requestBody),
      };

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('toUserId'),
        }),
      );
    });

    it('should return 500 when Dynamo fails to pull the user', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequestBody),
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

    it('should return 500 when Dynamo fails to create the request', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequestBody),
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
        .mockResolvedValue([sampleReductionRequestDTO]);

      const response = await get(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        JSON.stringify([sampleReductionRequestDTO]),
      );
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
    let validRequestBody: Partial<UpdateRequest>;
    beforeEach(() => {
      validRequestBody = {
        status: RequestStatus.APPROVED,
        numHours: 10,
      };

      jest.spyOn(DynamoUtilities, 'put').mockImplementation(
        async params =>
          new Promise((resolve, reject) => {
            if (params.TableName === process.env.requestsTable) {
              resolve(sampleReductionRequestDTO);
            } else {
              resolve(sampleUser);
            }
          }),
      );

      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(
        async params =>
          new Promise((resolve, reject) => {
            if (params.Key.requestId === sampleReductionRequestId) {
              resolve(sampleReductionRequestDTO);
            } else if (params.Key.requestId === sampleTransferRequestId) {
              resolve(sampleTransferRequestDTO);
            } else {
              reject(new Error('not found'));
            }
          }),
      );
    });

    describe('Validation tests', () => {
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
            requestId: sampleReductionRequestId,
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
            requestId: sampleReductionRequestId,
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

      it('should return 400 when the request doesnt exist', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: 'not-a-real-request-id',
          },
          body: JSON.stringify(validRequestBody),
        };

        jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(null);

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.DYNAMO_REQUESTID_NOT_FOUND,
          }),
        );
      });

      it('should return 500 when the request lookup fails', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify(validRequestBody),
        };

        const sampleErrorMessage = 'sample error message';

        jest
          .spyOn(DynamoUtilities, 'get')
          .mockRejectedValue(new Error(sampleErrorMessage));

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(
          JSON.stringify({
            message: sampleErrorMessage,
          }),
        );
      });
    });

    describe('Update reduction request', () => {
      it('should return a 200 and update the user and request when approved', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          JSON.stringify(sampleReductionRequestDTO),
        );
      });

      it('should return a 200 and update the request to denied when denied', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.DENIED,
          }),
        };

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          JSON.stringify(sampleReductionRequestDTO),
        );
      });

      it('should return a 400 when the user doesnt exist', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };

        jest.spyOn(DynamoUtilities, 'get').mockImplementation(
          async params =>
            new Promise((resolve, reject) => {
              if (params.Key.requestId === sampleReductionRequestId) {
                resolve(sampleReductionRequestDTO);
              } else if (params.Key.userId === sampleUserId) {
                resolve(null);
              } else {
                reject(new Error('something happened'));
              }
            }),
        );

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.DYNAMO_USERID_NOT_FOUND }),
        );
      });

      it('should return a 500 when getting user fails', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };
        const errorMessage = 'sample error message';

        jest
          .spyOn(DynamoUtilities, 'get')
          .mockRejectedValue(new Error(errorMessage));

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(
          JSON.stringify({
            message: errorMessage,
          }),
        );
      });

      it('should return a 500 when updating dynamo fails', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleReductionRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.DENIED,
          }),
        };

        const errorMessage = 'error to update request';

        jest
          .spyOn(DynamoUtilities, 'put')
          .mockRejectedValue(new Error(errorMessage));

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(
          JSON.stringify({ message: errorMessage }),
        );
      });
    });

    describe('Update transfer request', () => {
      it('should return a 200 and update both users and request when approved', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleTransferRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          JSON.stringify(sampleReductionRequestDTO),
        );
      });

      it('should return a 200 and update the request to denied when denied', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleTransferRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.DENIED,
          }),
        };

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          JSON.stringify(sampleReductionRequestDTO),
        );
      });

      it('should return a 400 when the user doesnt exist', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleTransferRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };

        jest.spyOn(DynamoUtilities, 'get').mockImplementation(
          async params =>
            new Promise((resolve, reject) => {
              if (params.Key.requestId === sampleTransferRequestId) {
                resolve(sampleTransferRequestDTO);
              } else if (params.Key.userId === sampleUserId) {
                resolve(null);
              } else {
                reject(new Error('something happened'));
              }
            }),
        );

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.DYNAMO_USERID_NOT_FOUND }),
        );
      });

      it('should return a 500 when getting user fails', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleTransferRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.APPROVED,
            numHours: 10,
          }),
        };
        const errorMessage = 'sample error message';

        jest
          .spyOn(DynamoUtilities, 'get')
          .mockRejectedValue(new Error(errorMessage));

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(
          JSON.stringify({
            message: errorMessage,
          }),
        );
      });

      it('should return a 500 when updating dynamo fails', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          pathParameters: {
            requestId: sampleTransferRequestId,
          },
          body: JSON.stringify({
            status: RequestStatus.DENIED,
          }),
        };

        const errorMessage = 'error to update request';

        jest
          .spyOn(DynamoUtilities, 'put')
          .mockRejectedValue(new Error(errorMessage));

        const response = await update(mockEvent);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(
          JSON.stringify({ message: errorMessage }),
        );
      });
    });
  });
});
