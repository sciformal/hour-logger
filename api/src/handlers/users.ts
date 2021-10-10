/**
 * Main entry point for all users endpoints.
 */

import { ErrorConstants } from "../constants/errors";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoDb = new DocumentClient();

// TODO: Block users from creating users with same student number.
// Add student number as primary key in db table.
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const createUser = (
  event: APIGatewayProxyEvent
): APIGatewayProxyResult => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  if (!event.body) {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_MISSING
      }),
    };
  }

  const data = JSON.parse(event.body);

  if (!data.firstName) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_FIRSTNAME
      }),
    };
    return response;
  }

  if (!data.lastName) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_LASTNAME
      }),
    };
    return response;
  }

  if (!data.email) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_EMAIL
      }),
    };
    return response;
  }

  if (!data.studentNumber) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER
      }),
    };
    return response;
  }

  if (!data.userId) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: ErrorConstants.VALIDATION_BODY_USERID
      }),
    };
    return response;
  }

  const params = {
    TableName: process.env.userTable,
    Item: {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      studentNumber: data.studentNumber,
      hours: 0,
      hoursNeeded: process.env.defaultHoursRequired,
      type: data.type || "USER",
    },
  };

  dynamoDb.put(params, (error, data) => {
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error }),
      };
      return response;
    }

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    };
    return response;
  });
};

export function getUser(event, context, callback) {
  const userId = event.requestContext.identity.cognitoIdentityId || "abcdefg";

  const params = {
    TableName: process.env.userTable,
    Key: {
      userId,
    },
  };

  // TODO: Return error if nothing exists.
  dynamoDb.get(params, (error, data) => {
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error }),
      };
      callback(null, response);
      return;
    }

    // Return status code 200 and the newly created item
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data.Item),
    };
    callback(null, response);
  });
}
