import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UsersUtilities } from '../util/user-utilities';
import { ErrorConstants } from '../constants/errors';
import { DynamoUtilities } from '../util/dynamo-utilities';
import { User } from '../types/models/User';
import { ResponseUtilities } from '../util/response-utilities';
import { UserType } from '../types/models/UserType';

const dynamoDb = new DocumentClient();

/**
 * Create a user in the DynamoDB table and initialize their hours to 0.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The created user object.
 */
export const createUser = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
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

  if (!data.firstName) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_FIRSTNAME,
    );
  }

  if (!data.lastName) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_LASTNAME,
    );
  }

  if (!data.email) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_EMAIL,
    );
  }

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
    );
  }

  if (!data.userId) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_USERID,
    );
  }

  if (!/^\d+$/.test(data.studentNumber)) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_STUDENTNUMBER_NONNUM,
    );
  }

  if (data.studentNumber.length !== 8) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_STUDENTNUMBER_LENGTH,
    );
  }

  if (!data.userType) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_USER_SITUATION,
    );
  }

  const requiredHours = UsersUtilities.totalHours(data.userSituation);

  const userPayload: User = {
    ...data,
    hours: 0,
    finalHours: 0,
    finalHoursNeeded: requiredHours.finalHoursNeeded,
    regularHoursNeeded: requiredHours.regularHoursNeeded,
    type: data.userType || UserType.USER,
    isCheckedIn: false,
    transactions: [],
  };

  const params = {
    TableName: process.env.userTable,
    Item: userPayload,
  };

  try {
    const uniqueStudentNumber = await UsersUtilities.uniqueStudentNumber(
      data.studentNumber,
    );
    if (!uniqueStudentNumber) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER,
      );
    }

    const user = await DynamoUtilities.put(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(user);
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
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_PATH_MISSING,
    );
  }

  const { userId } = event.pathParameters;

  if (!userId) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_PATH_INVALID,
    );
  }

  const params = {
    TableName: process.env.userTable,
    Key: {
      userId,
    },
  };

  try {
    const user = await DynamoUtilities.get(params, dynamoDb);
    if (!user) {
      // no user exists
      return ResponseUtilities.createSuccessResponse(user, 204);
    }

    const requestParams = {
      TableName: process.env.reductionRequestsTable,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :v_title',
      ExpressionAttributeValues: {
        ':v_title': user.userId,
      },
      ScanIndexForward: false,
    };

    const requests = await DynamoUtilities.query(requestParams, dynamoDb);
    const compoundUser = {
      ...user,
      requests,
    };

    return ResponseUtilities.createSuccessResponse(compoundUser);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const getAllUsers = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const params = {
    TableName: process.env.userTable,
  };

  try {
    const users = await DynamoUtilities.scan(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(users);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

/**
 * Delete a user from the DynamoDB Table.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns A 200 status code or a 204 if no user was deleted.
 */
export const deleteUser = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_PATH_MISSING,
    );
  }

  const { userId } = event.pathParameters;

  if (!userId) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_PATH_INVALID,
    );
  }

  const params = {
    TableName: process.env.userTable,
    Key: {
      userId,
    },
  };

  try {
    const user = await DynamoUtilities.delete(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(user, 204);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};
