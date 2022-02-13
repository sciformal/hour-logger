import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ErrorConstants } from '../../src/constants/errors';
import { DynamoUtilities } from '../util/dynamo-utilities';
import { ResponseUtilities } from '../util/response-utilities';
import { HoursUtilities } from '../util/hours-utilities';

const dynamoDb = new DocumentClient();
/**
 * Check-in or check-out a student based on their student number,
 * add the transaction and update their hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */
export const checkIn = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING,
    );
  }

  const data = JSON.parse(event.body);

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.createValidationString('studentNumber'),
    );
  }
  const { studentNumber } = data;

  const params = {
    TableName: process.env.userTable,
    IndexName: 'StudentNumberIndex',
    KeyConditionExpression: 'studentNumber = :v_title',
    ExpressionAttributeValues: {
      ':v_title': studentNumber,
    },
    ScanIndexForward: false,
  };

  try {
    const userList = await DynamoUtilities.query(params, dynamoDb);

    // TODO: This should throw a 400
    if (userList.length === 0) {
      throw new Error(ErrorConstants.DYNAMO_STUDENTNUMBER_NOTFOUND);
    }

    // TODO: This should throw a 400
    if (userList.length > 1) {
      throw new Error(ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER);
    }

    const user = userList[0];
    const newUser = HoursUtilities.handleCheckInProcess(user);

    const putParams = {
      TableName: process.env.userTable,
      Item: newUser,
    };
    await DynamoUtilities.put(putParams, dynamoDb);

    return ResponseUtilities.createSuccessResponse(newUser);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

/**
 * Update a student's hours based on their student number,
 * add the transaction and update their hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */

// TODO: decrease hours?
export const updateHours = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING,
    );
  }

  const data = JSON.parse(event.body);

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.createValidationString('studentNumber'),
    );
  }
  if (!data.checkIn) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.createValidationString('checkIn'),
    );
  }
  if (!data.checkOut) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.createValidationString('checkOut'),
    );
  }

  const params = {
    TableName: process.env.userTable,
    IndexName: 'StudentNumberIndex',
    KeyConditionExpression: 'studentNumber = :v_title',
    ExpressionAttributeValues: {
      ':v_title': data.studentNumber,
    },
    ScanIndexForward: false,
  };
  try {
    const userList = await DynamoUtilities.query(params, dynamoDb);

    if (userList.length !== 1) {
      throw new Error(ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER);
    }

    const user = userList[0];
    const newUser = HoursUtilities.handleUpdateHoursProcess(
      user,
      data.checkIn,
      data.checkOut,
    );

    const putParams = {
      TableName: process.env.userTable,
      Item: newUser,
    };
    await DynamoUtilities.put(putParams, dynamoDb);

    return ResponseUtilities.createSuccessResponse(newUser);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};
