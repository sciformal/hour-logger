import { HoursUtilities } from "./../util/hoursUtilities";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AWS from "aws-sdk";
import {
  APIGatewayProxyEvent,
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoUtilities } from "../util/dynamo";
import { ResponseUtilities } from "../util/response";
import { ErrorConstants } from "../../src/constants/errors";

const dynamoDb = new DocumentClient();
/**
 * Check-in or check-out a student based on their student number, add the transaction and update their hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */
export const checkIn = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING
    );
  }

  const data = JSON.parse(event.body);

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STUDENTNUMBER
    );
  }
  const { studentNumber } = data;

  const params = {
    TableName: process.env.userTable,
    IndexName: "StudentNumberIndex",
    KeyConditionExpression: "studentNumber = :v_title",
    ExpressionAttributeValues: {
      ":v_title": studentNumber,
    },
    ScanIndexForward: false,
  };

  try {
    const userList = await DynamoUtilities.query(params, dynamoDb);

    if (userList.length != 1) {
      throw new Error(ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER);
    }

    const user = userList[0];
    const newUser = HoursUtilities.handleCheckInProcess(user);

    const putParams = {
      TableName: process.env.userTable,
      Item: newUser,
    };
    await DynamoUtilities.put(putParams, dynamoDb);

    return ResponseUtilities.createAPIResponse(newUser);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

/**
 * Update a student's hours based on their student number, add the transaction and update their hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */

export const updateHours = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING
    );
  }

  const data = JSON.parse(event.body);

  if (!data.studentNumber) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STUDENTNUMBER
    );
  }
  if (!data.checkIn) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_CHECKIN
    );
  }
  if (!data.checkOut) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_CHECKOUT
    );
  }

  const params = {
    TableName: process.env.userTable,
    IndexName: "StudentNumberIndex",
    KeyConditionExpression: "studentNumber = :v_title",
    ExpressionAttributeValues: {
      ":v_title": data.studentNumber,
    },
    ScanIndexForward: false,
  };
  try {
    const userList = await DynamoUtilities.query(params, dynamoDb);

    if (userList.length != 1) {
      throw new Error(ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER);
    }

    const user = userList[0];
    // create new transaction element. add it to user
    // loop over all transactions and recalculate hours
    // update user

    const putParams = {
      TableName: process.env.userTable,
      Item: newUser,
    };
    await DynamoUtilities.put(putParams, dynamoDb);

    return ResponseUtilities.createAPIResponse(newUser);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }



  return;
};
