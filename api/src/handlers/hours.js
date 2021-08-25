/**
 * 
 * POST /check-in
 * {
 *      "studentNumber",
 *      "time"
 * }
 * 
 * - Using the student number, find the user from the user table.
 * - Using the userId, find their hours transaction table.
 * - If (isCheckedIn) {
 *      - now they are signing out.
*       - complete the transaction (add checkout time)
        - update their user object in the user table.
 * } else {
     add a new entry in "transactions", with checkOutTime = null and isCheckIn = true;
 }
 * 
 * {
 *      userId: "",
 *      transactions: [
 *          {
 *              checkInTime: "blah"
 *              checkOutTime: "blah"
 *          }
 *      ],
 *      isCheckedIn: boolean;
 * }
 *  
 * */

import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export function checkIn(event, context, callback) {
  const data = JSON.parse(event.body);
  const { studentNumber } = data;

  // TODO: Add validation request body here.

  const params = {
    TableName: process.env.userTable,
    IndexName: "StudentNumberIndex",
    KeyConditionExpression: "studentNumber = :v_title",
    ExpressionAttributeValues: {
      ":v_title": studentNumber,
    },
    ScanIndexForward: false,
  };

  // TODO: Return error if nothing exists.
  dynamoDb.query(params, (error, data) => {
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error }),
      };
      console.log(error);
      callback(null, response);
      return;
    }

    // Return status code 200 and the newly created item
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data),
    };
    console.log(response);
    callback(null, response);
  });
}
