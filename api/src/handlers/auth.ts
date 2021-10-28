import { CustomEmails } from '../constants/emails';

/**
 * Send a custom email to a user on registration.
 *
 * @param event The Cognito Trigger Event.
 * @param _context Nothing here.
 * @param callback The callback function from the lambda.
 */
export const register = (event, _context, callback) => {
  const name = event.request.userAttributes.given_name;
  const code = event.request.codeParameter;
  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response = {
      emailSubject: CustomEmails.CONFIRMATION_CODE_SUBJECT,
      emailMessage: CustomEmails.createConfirmationCodeEmail(name, code),
    };
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword'){
    event.response = {
      emailSubject: CustomEmails.PASSWORD_RESET_SUBJECT,
      emailMessage: CustomEmails.createResetPasswordEmail(name, code),
    };
  }

  callback(null, event);
};
