import { CustomEmails } from '../constants/emails';
import { ErrorConstants } from '../constants/errors';
import { UserSituation } from '../types/models/UserType';
import { ResponseUtilities } from '../util/response-utilities';
import { UsersUtilities } from '../util/user-utilities';

/**
 * Perform custom validation before signing up a user.
 *
 * @param event The Cognito Trigger Event.
 * @param _context Nothing here.
 * @param callback The callback function from the lambda.
 */
export const preSignUpValidation = async event => {
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING,
    );
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_INVALID,
    );
  }

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
    );
  }

  if (!data.userType) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_USERTYPE,
    );
  }

  const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(
    data.studentNumber,
  );

  if (!uniqueStudentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER,
    );
  }

  if (!Object.values(UserSituation).includes(data.userType)) {
    return ResponseUtilities.createErrorResponse('invalid user type');
  }

  return ResponseUtilities.createSuccessResponse({ message: 'nice' });
};

/**
 * Send a custom email to a user on registration.
 *
 * @param event The Cognito Trigger Event.
 * @param _context Nothing here.
 * @param callback The callback function from the lambda.
 */
export const customEmails = (event, _context, callback) => {
  const name = event.request.userAttributes.given_name;
  const code = event.request.codeParameter;
  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response = {
      emailSubject: CustomEmails.CONFIRMATION_CODE_SUBJECT,
      emailMessage: CustomEmails.createConfirmationCodeEmail(name, code),
    };
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response = {
      emailSubject: CustomEmails.PASSWORD_RESET_SUBJECT,
      emailMessage: CustomEmails.createResetPasswordEmail(name, code),
    };
  }

  callback(null, event);
};
