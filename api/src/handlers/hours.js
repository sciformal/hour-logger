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
 * 
 * - create new dynamo db table "transactions"
 * - query transactions to see if they are checked in
 * - do logic above
 * - curent check out logic, we will delete the record from transaction table
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

    const user = data.Items[0];

    if (user.isCheckedIn) { // check them out
      const newUser = user;
      newUser.isCheckedIn = false;
      let timeElapsed;

      const updatedTransactions = [];

      newUser.transactions.forEach(el => {
        if (el.checkOutTime == null) {
          el.checkOutTime = new Date().toString();
          // result of date arithmetic is in milliseconds and then converted to hours
          timeElapsed = (Date.parse(el.checkOutTime) - Date.parse(el.checkInTime)) / (60 * 60 * 1000);
          // TODO: loop over transactions and recalculate hours
          newUser.hours += timeElapsed;
        }
        updatedTransactions.push(el);
      });

      newUser.transactions = updatedTransactions;

      const params = {
        TableName: process.env.userTable,
        Item: newUser
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

    } else {
      const checkInTime = new Date().toString();
      const newUser = user;

      newUser.isCheckedIn = true;
      const newTransaction = {
        checkInTime,
        checkOutTime: null
      }

      if (newUser.transactions) {
        newUser.transactions.push(newTransaction)
      } else {
        var transactions = [];
        transactions.push(newTransaction)
        newUser.transactions = transactions;
      }
      
      const params = {
        TableName: process.env.userTable,
        Item: newUser
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

    callback(null, response);
  });
}
