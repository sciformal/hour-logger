import { CustomEmails } from '../../src/constants/emails';
import { customEmails } from '../../src/handlers/auth';
import { sampleApiGatewayEvent } from '../mocks/event';

describe('Authentication Tests', () => {
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
