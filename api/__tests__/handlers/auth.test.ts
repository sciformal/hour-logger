import { APIGatewayProxyEvent } from 'aws-lambda';
import { CustomEmails } from '../../src/constants/emails';
import { ErrorConstants } from '../../src/constants/errors';
import { customEmails, preSignUpValidation } from '../../src/handlers/auth';
import { UserType } from '../../src/types/database/User';
import { UserValidationRequest } from '../../src/types/interface/Auth';
import { ResponseUtilities } from '../../src/util/response-utilities';
import { UsersUtilities } from '../../src/util/user-utilities';
import { sampleApiGatewayEvent } from '../mocks/event';
import { sampleStudentNumber } from '../mocks/user';

describe('Authentication Tests', () => {
  describe('Pre signup validation', () => {
    let validRequest: UserValidationRequest;
    beforeEach(() => {
      validRequest = {
        studentNumber: sampleStudentNumber,
        userType: UserType.GUEST,
      };
    });

    it('should return 400 when the request doesnt contain a body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING }),
      );
    });

    it('should return 400 when the request doesnt contain a valid body', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: 'this is invalid',
      };

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_INVALID }),
      );
    });

    it('should return 400 when the request doesnt contain a student number', async () => {
      delete validRequest.studentNumber;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('studentNumber'),
        }),
      );
    });

    it('should return 400 when the request doesnt contain a userType', async () => {
      delete validRequest.userType;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.createValidationString('userType'),
        }),
      );
    });

    it('should return 400 when the request doesnt contain a valid user type', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify({
          ...validRequest,
          userType: 'invalid',
        }),
      };

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: 'invalid user type',
        }),
      );
    });

    it('should return 400 when the student number is taken', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      jest
        .spyOn(UsersUtilities, 'uniqueStudentNumber')
        .mockImplementation(() => null);

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER,
        }),
      );
    });

    it('should return 400 when the student number is taken', async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      jest
        .spyOn(UsersUtilities, 'uniqueStudentNumber')
        .mockImplementation(async () => true);

      const response = await preSignUpValidation(mockEvent);
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('custom email tests', () => {
    it('should modify the events email fields on sign up', () => {
      const signUpEvent = {
        ...sampleApiGatewayEvent,
        request: {
          codeParameter: '12345',
          userAttributes: {
            given_name: 'John',
          },
        },
        triggerSource: 'CustomMessage_SignUp',
      };

      customEmails(signUpEvent, null, (err, data) => {
        expect(data.response.emailSubject).toEqual(
          CustomEmails.CONFIRMATION_CODE_SUBJECT,
        );
      });
    });
    it('should modify the events email fields on resend code', () => {
      const signUpEvent = {
        ...sampleApiGatewayEvent,
        request: {
          codeParameter: '12345',
          userAttributes: {
            given_name: 'John',
          },
        },
        triggerSource: 'CustomMessage_ResendCode',
      };

      customEmails(signUpEvent, null, (err, data) => {
        expect(data.response.emailSubject).toEqual(
          CustomEmails.CONFIRMATION_CODE_SUBJECT,
        );
      });
    });
    it('should modify the events email fields on forgot password', () => {
      const signUpEvent = {
        ...sampleApiGatewayEvent,
        request: {
          codeParameter: '12345',
          userAttributes: {
            given_name: 'John',
          },
        },
        triggerSource: 'CustomMessage_ForgotPassword',
      };

      customEmails(signUpEvent, null, (err, data) => {
        expect(data.response.emailSubject).toEqual(
          CustomEmails.PASSWORD_RESET_SUBJECT,
        );
      });
    });
  });
});
