import { ErrorConstants } from "../constants/errors";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoUtilities } from "../../src/util/dynamo";
import { GlobalConstants } from "../../src/constants/global";
import { User, UserType } from "../../src/types/User";
import { ResponseUtilities } from "../../src/util/response";

const dynamoDb = new DocumentClient();

/**
 * Create a user in the DynamoDB table and initialize their hours to 0.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The created user object.
 */
export const createUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  if (!event.body) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_MISSING);
  }

  const data = JSON.parse(event.body);

  if (!data.firstName) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_FIRSTNAME);
  }

  if (!data.lastName) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_LASTNAME);
  }

  if (!data.email) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_EMAIL);
  }

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_STUDENTNUMBER);
  }

  if (!data.userId) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_USERID);
  }

  const userPayload: User = {
    ...data,
    hours: 0,
    hoursNeeded: GlobalConstants.HOURS_NEEDED,
    type: data.type || UserType.USER,
    isCheckedIn: false,
    transactions: [],
  }
  
  const params = {
    TableName: process.env.userTable,
    Item: userPayload
  };

  try {
    const user = await DynamoUtilities.put(params, dynamoDb);
    return ResponseUtilities.createAPIResponse(user);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};


/**
 * Get a user from the DynamoDB Table.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The user object.
 */
export const getUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  if (!event.body) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_MISSING);
  }

  const data = JSON.parse(event.body);
  
  if (!data.userId) {
    return ResponseUtilities.createErrorResponse(ErrorConstants.VALIDATION_BODY_USERID);
  }

  const params = {
    TableName: process.env.userTable,
    Key: {
      userId: data.userId,
    },
  };

  try {
    const user = await DynamoUtilities.get(params, dynamoDb);
    return ResponseUtilities.createAPIResponse(user);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
}
