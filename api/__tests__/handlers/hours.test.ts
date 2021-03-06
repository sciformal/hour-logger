import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateHours, checkIn } from '../../src/handlers/hours';
import { HoursUtilities } from '../../src/util/hours-utilities';
import { sampleTransaction } from '../mocks/hours';
import { DynamoUtilities } from '../../src/util/dynamo-utilities';
import { ErrorConstants } from '../../src/constants/errors';
import { sampleApiGatewayEvent } from '../mocks/event';
import { CheckInRequest } from '../../src/types/interface/CheckIn';
import { sampleStudentNumber, sampleUser } from '../mocks/user';

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn(),
      query: jest.fn(),
      get: jest.fn(),
    })),
  },
}));

describe('Hours API Request', () => {
  describe('Check In Request', () => {
    const checkInRequest: CheckInRequest = {
      studentNumber: sampleStudentNumber,
    };

    const updatedUser = { ...sampleUser, transactions: [sampleTransaction] };

    // resets valid reuqest on each call to new test
    let validRequest;
    beforeEach(() => {
      jest.spyOn(DynamoUtilities, 'query').mockResolvedValue([sampleUser]);
      jest.spyOn(DynamoUtilities, 'put').mockResolvedValue(sampleUser);
      jest
        .spyOn(HoursUtilities, 'handleCheckInProcess')
        .mockReturnValue(updatedUser);
      validRequest = {
        ...checkInRequest,
      };
    });

    // return 200 when everything works
    it("should return a 200 when updating user's checkin successfully", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(updatedUser));
    });

    it('should return 400 when the request doesnt contain a body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING }),
      );
    });

    it('should return 400 when the request body doesnt contain studentNumber', async () => {
      delete validRequest.studentNumber;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('studentNumber'),
        }),
      );
    });

    it('should return 500 when Dynamo returns more than one student per student number', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const userList = [sampleUser, sampleUser];
      jest.spyOn(DynamoUtilities, 'query').mockResolvedValue(userList);

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER,
        }),
      );
    });

    it('should return 500 when Dynamo fails to update the user', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };
      const sampleErrorMessage = 'sample error message';

      jest
        .spyOn(DynamoUtilities, 'put')
        .mockRejectedValue(new Error(sampleErrorMessage));

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: sampleErrorMessage,
        }),
      );
    });
  });

  describe('Update hours request', () => {
    const updateHoursRequest = {
      studentNumber: sampleStudentNumber,
      checkIn: 'Tue Oct 12 2021 20:57:17 GMT+0000 (Coordinated Universal Time)',
      checkOut:
        'Tue Oct 12 2021 22:57:20 GMT+0000 (Coordinated Universal Time)',
      hours: 1,
    };

    let validRequest;
    beforeEach(() => {
      validRequest = {
        ...updateHoursRequest,
      };
    });

    it('should return 400 when the request doesnt contain a body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = await updateHours(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING }),
      );
    });

    it('should return 400 when the request body doesnt contain studentNumber', async () => {
      delete validRequest.studentNumber;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await updateHours(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('studentNumber'),
        }),
      );
    });

    it('should return 400 when the request body doesnt contain checkIn', async () => {
      delete validRequest.checkIn;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await updateHours(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('checkIn'),
        }),
      );
    });

    it('should return 400 when the request body doesnt contain checkOut', async () => {
      delete validRequest.checkOut;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await updateHours(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('checkOut'),
        }),
      );
    });
  });
});
