export class ErrorConstants {
  public static createValidationString(field: string) {
    return `The request body is missing the ${field} field`;
  }

  public static readonly VALIDATION_BODY_MISSING =
    'The request body is missing in the API Event.';

  public static readonly VALIDATION_BODY_INVALID =
    'The request body is invalid. Please ensure it is a valid JSON.';

  public static readonly VALIDATION_PATH_MISSING =
    'The request is missing a required path parameters.';

  public static readonly VALIDATION_PATH_INVALID =
    'The request path parameter is invalid.';

  public static readonly VALIDATION_STUDENTNUMBER_NONNUM =
    'The student number contains non numeric characters.';

  public static readonly VALIDATION_STUDENTNUMBER_LENGTH =
    'The student number must be 8 digits.';

  public static readonly VALIDATION_BODY_TYPE_INVALID =
    'The request type is invalid. Valid options are REDUCTION, TRANSFER';

  public static readonly VALIDATION_BODY_STATUS_INVALID =
    'The status field is invalid. Valid options are APPROVED, DENIED';

  public static readonly DYNAMO_REQUESTID_NOT_FOUND =
    'The requestId is not found in the database.';

  public static readonly DYNAMO_NONUNIQUE_STUDENTNUMBER =
    'DynamoDB query should have only 1 user per studentNumber.';

  public static readonly DYNAMO_USERID_NOT_FOUND =
    'The userId does not exist in the users table.';
}
