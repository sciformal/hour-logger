export class ErrorConstants {
  public static readonly VALIDATION_BODY_MISSING =
    'The request body is missing in the API Event.';

  public static readonly VALIDATION_BODY_INVALID =
    'The request body is invalid. Please ensure it is a valid JSON.';

  public static readonly VALIDATION_BODY_FIRSTNAME =
    'The request body is missing the firstName field.';

  public static readonly VALIDATION_BODY_LASTNAME =
    'The request body is missing the lastName field.';

  public static readonly VALIDATION_BODY_EMAIL =
    'The request body is missing the email field.';

  public static readonly VALIDATION_BODY_STUDENTNUMBER =
    'The request body is missing the studentNumber field.';

  public static readonly VALIDATION_BODY_USERID =
    'The request body is missing the userId field.';

  public static readonly VALIDATION_BODY_CHECKIN =
    'The request body is missing the checkIn field';

  public static readonly VALIDATION_BODY_CHECKOUT =
    'The request body is missing the checkOut field';

  public static readonly VALIDATION_PATH_MISSING =
    'The request is missing a required path parameters.';

  public static readonly VALIDATION_PATH_INVALID =
    'The request path parameter is invalid.';

  public static readonly VALIDATION_STUDENTNUMBER_NONNUM =
    'The student number contains non numeric characters.';

  public static readonly VALIDATION_STUDENTNUMBER_LENGTH =
    'The student number must be 8 digits.';

  public static readonly VALIDATION_BODY_REDUCTION_REQUEST_MESSAGE =
    'The request body is missing the hour reduction reasoning';

  public static readonly DYNAMO_NONUNIQUE_STUDENTNUMBER =
    'DynamoDB query should have only 1 user per studentNumber.';
}
