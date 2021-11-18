import { UserSituation } from './../../src/types/requests/UserRequest';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { UsersUtilities } from '../../src/util/usersUtilities';
import { ErrorConstants } from '../../src/constants/errors';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from '../../src/handlers/users';
import { UserRequest } from '../../src/types/requests/UserRequest';
import { DynamoUtilities } from '../../src/util/dynamo';
import { sampleApiGatewayEvent } from '../mocks/event';
import { sampleUser, sampleUserId, sampleUserRequest } from '../mocks/user';

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn(),
      query: jest.fn(),
      get: jest.fn(),
    })),
  },
}));

describe('User Endpoint Tests', () => {
  // organizes tests
  describe('Create User Tests', () => {
    let validUser: Partial<UserRequest>;

    beforeEach(() => {
      validUser = {
        ...sampleUserRequest,
      };
    });

    // implements individual test cases
    it('should return a 200 when creating a user successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      jest.spyOn(DynamoUtilities, 'put').mockResolvedValue(sampleUser);
      jest.spyOn(UsersUtilities, 'uniqueStudentNumber').mockResolvedValue(true);

      const response = await createUser(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });

    it('should throw a 500 when DynamoDB fails', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const errMessage = 'failed to put in dynamo';

      jest.spyOn(UsersUtilities, 'uniqueStudentNumber').mockResolvedValue(true);

      jest
        .spyOn(DynamoUtilities, 'put')
        .mockRejectedValue(new Error(errMessage));

      const response = await createUser(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(JSON.stringify({ message: errMessage }));
    });

    describe('Validation Tests', () => {
      it('should return 400 when the request doesnt contain a body', async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
        };

        const response = await createUser(mockEvent);
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

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_INVALID }),
        );
      });

      it('should return 400 when the request body doesnt contain firstName', async () => {
        delete validUser.firstName;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_FIRSTNAME }),
        );
      });

      it('should return 400 when the request body doesnt contain lastName', async () => {
        delete validUser.lastName;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_LASTNAME }),
        );
      });

      it('should return 400 when the request body doesnt contain email', async () => {
        delete validUser.email;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_EMAIL }),
        );
      });

      it('should return 400 when the request body doesnt contain studentNumber', async () => {
        delete validUser.studentNumber;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
          }),
        );
      });

      it('should return 400 when the request body doesnt contain userId', async () => {
        delete validUser.userId;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_USERID }),
        );
      });
      it('should return 400 when the request body doesnt contain userSituation', async () => {
        delete validUser.userSituation;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_USER_SITUATION }),
        );
      });

      it('should return 400 when the student number contains non numeric characters', async () => {
        validUser.studentNumber = '1234abcd';

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_STUDENTNUMBER_NONNUM,
          }),
        );
      });

      it('should return 400 when the student number contains more than 8 digits', async () => {
        validUser.studentNumber = '123456789';

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_STUDENTNUMBER_LENGTH,
          }),
        );
      });

      it('should return 400 when the student number contains less than 8 digits', async () => {
        validUser.studentNumber = '1234567';

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_STUDENTNUMBER_LENGTH,
          }),
        );
      });
    });
  });

  describe('Get User Tests', () => {
    it('should return a 200 when getting a user successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId,
        },
      };

      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(sampleUser);

      const response = await getUser(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });

    it('should return a 204 when getting a user doesnt exist', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId,
        },
      };

      jest.spyOn(DynamoUtilities, 'get').mockResolvedValue(null);

      const response = await getUser(mockEvent);
      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual(JSON.stringify(null));
    });

    it('should return a 400 when getting a user invalid path', async () => {
      let response;

      const mockEventMissingPath: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const mockEventInvalidPath: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: null,
        },
      };

      response = await getUser(mockEventMissingPath);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_PATH_MISSING }),
      );

      response = await getUser(mockEventInvalidPath);
      JSON.stringify({ message: ErrorConstants.VALIDATION_PATH_INVALID });
    });

    it('should return a 500 when getting a user fails dynamo', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId,
        },
      };

      const errorMessage = 'Error message from dynamo';

      jest
        .spyOn(DynamoUtilities, 'get')
        .mockRejectedValue(new Error(errorMessage));

      const response = await getUser(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(JSON.stringify({ message: errorMessage }));
    });
  });

  describe('Get All Users Tests', () => {
    it('should return a 200 when getting all users', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      jest.spyOn(DynamoUtilities, 'scan').mockResolvedValue([sampleUser]);

      const response = await getAllUsers(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify([sampleUser]));
    });

    it('should return a 500 when getting users fails to dynamo', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const errorMessage = 'Dynamodb error message';
      jest
        .spyOn(DynamoUtilities, 'scan')
        .mockRejectedValue(new Error(errorMessage));

      const response = await getAllUsers(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(JSON.stringify({ message: errorMessage }));
    });
  });

  describe('Delete User Tests', () => {
    it('should return a 204 when deleting a user successfully', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId,
        },
      };

      jest.spyOn(DynamoUtilities, 'delete').mockResolvedValue();

      const response = await deleteUser(mockEvent);
      expect(response.statusCode).toEqual(204);
    });

    it('should return a 400 when deleting a user invalid path', async () => {
      let response;

      const mockEventMissingPath: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const mockEventInvalidPath: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: null,
        },
      };

      response = await deleteUser(mockEventMissingPath);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_PATH_MISSING }),
      );

      response = await deleteUser(mockEventInvalidPath);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_PATH_INVALID }),
      );
    });

    it('should return a 500 when deleting a user fails on dynamo delete', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId,
        },
      };

      jest.spyOn(DynamoUtilities, 'delete').mockResolvedValue();

      const response = await deleteUser(mockEvent);
      expect(response.statusCode).toEqual(204);
    });
  });
});
