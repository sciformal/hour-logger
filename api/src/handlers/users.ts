/**
 * Main entry point for all users endpoints.
 */

import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// TODO: Block users from creating users with same student number.
// Add student number as primary key in db table.
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export function createUser(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  if (!data) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "Body was not passed in the request!",
      }),
    };
    callback(null, response);
  }
  if (!data.firstName) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "firstName was not passed in the request!",
      }),
    };
    callback(null, response);
  }
  if (!data.lastName) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "lastName was not passed in the request!",
      }),
    };
    callback(null, response);
  }
  if (!data.email) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "email was not passed in the request!",
      }),
    };
    callback(null, response);
  }
  if (!data.studentNumber) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "school was not passed in the request!",
      }),
    };
    callback(null, response);
  }

  if (!data.userId) {
    const response = {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        message: "User ID was not passed in the request!",
      }),
    };
    callback(null, response);
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
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
}

export function getUser(event, context, callback) {

  const userId = event.requestContext.identity.cognitoIdentityId || 'abcdefg';


  const params = {
    TableName: process.env.userTable,
    Key: {
      userId
    }
  }

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
