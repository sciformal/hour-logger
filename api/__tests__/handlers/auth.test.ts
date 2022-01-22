import { APIGatewayProxyEvent } from 'aws-lambda';
import { CustomEmails } from '../../src/constants/emails';
import { ErrorConstants } from '../../src/constants/errors';
import { customEmails, preSignUpValidation } from '../../src/handlers/auth';
import { sampleApiGatewayEvent } from '../mocks/event';

describe('Authentication Tests', () => {
  describe('Pre signup validation', () => {
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
  });
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
});
