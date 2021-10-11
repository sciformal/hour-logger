export class ErrorConstants {
    public static readonly VALIDATION_BODY_MISSING = "The request body is missing in the API Event.";
    public static readonly VALIDATION_BODY_INVALID = "The request body is invalid. Please ensure it is a valid JSON";
    public static readonly VALIDATION_BODY_FIRSTNAME = "The request body is missing the firstName field.";
    public static readonly VALIDATION_BODY_LASTNAME = "The request body is missing the lastName field.";
    public static readonly VALIDATION_BODY_EMAIL = "The request body is missing the email field.";
    public static readonly VALIDATION_BODY_STUDENTNUMBER = "The request body is missing the studentNumber field.";
    public static readonly VALIDATION_BODY_USERID = "The request body is missing the userId field.";
    public static readonly VALIDATION_PATH_MISSING = "The request is missing a required path parameters.";
}