import AWS from "aws-sdk";
import {
  APIGatewayProxyEvent,
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoUtilities } from "@util/dynamo";
import { ResponseUtilities } from "@util/response";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Check-in or check-out a student based on their student number, add the transaction and update their hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */
export const checkIn: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);
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
    const userList = await DynamoUtilities.queryDynamo(params, dynamoDb);

    if (userList.length != 1) {
      throw new Error(
        "DynamoDB query should have only 1 user per studentNumber"
      );
    }

    const user = userList[0];
    await handleCheckInProcess(user);
    return ResponseUtilities.apiResponse(user, 200);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.apiResponse(err.message, 500);
  }
};

/**
 * Fetch all hours for all users.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns All users
 */
export const getAllHours: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  // const params = {
  //   TableName: process.env.userTable,
  //   ProjectionExpression: "studentNumber, firstName, lastName, hours, hoursNeeded"
  // }
  return ResponseUtilities.apiResponse("Fetched all user hours!", 200);
};

/**
 * Edit a given users hours.
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 * 
 * Something is broken. Only updates hours after 2 calls to API
 */
export const editHours: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);
  //const { studentNumber } = data;

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
    const userList = await DynamoUtilities.queryDynamo(params, dynamoDb);

    if (userList.length != 1) {
      throw new Error(
        "DynamoDB query should have only 1 user per studentNumber"
      );
    }
    //const user = userList[0];
    //const newUser = user;
    userList[0].hours = parseFloat(userList[0].hours) + data.updateHours;

    const params2 = {
      TableName: process.env.userTable,
      Item: userList[0],
    };

    await dynamoDb.put(params2).promise().then(data => console.log(data.Attributes)).catch(console.error);
    return ResponseUtilities.apiResponse(userList[0], 200);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.apiResponse(err.message, 500);
  }
};

const handleCheckInProcess = async (user): Promise<void> => {
  if (user.isCheckedIn) {
    // check them out
    const newUser = user;
    newUser.isCheckedIn = false;
    let timeElapsed;

    const updatedTransactions = [];

    newUser.transactions.forEach((el) => {
      if (el.checkOutTime == null) {
        el.checkOutTime = new Date().toString();
        // result of date arithmetic is in milliseconds and then converted to hours
        timeElapsed =
          (Date.parse(el.checkOutTime) - Date.parse(el.checkInTime)) /
          (60 * 60 * 1000);
        // TODO: loop over transactions and recalculate hours
        newUser.hours += timeElapsed;
      }
      updatedTransactions.push(el);
    });

    newUser.transactions = updatedTransactions;

    const params = {
      TableName: process.env.userTable,
      Item: newUser,
    };

    // dynamoDb.put(params, (error, data) => {
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // });
    await dynamoDb.put(params).promise().then(data => console.log(data.Attributes)).catch(console.error);

  } else {
    const checkInTime = new Date().toString();
    const newUser = user;

    newUser.isCheckedIn = true;
    const newTransaction = {
      checkInTime,
      checkOutTime: null,
    };

    if (newUser.transactions) {
      newUser.transactions.push(newTransaction);
    } else {
      var transactions = [];
      transactions.push(newTransaction);
      newUser.transactions = transactions;
    }

    const params = {
      TableName: process.env.userTable,
      Item: newUser,
    };

    // dynamoDb.put(params, (error, data) => {
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // });
    await dynamoDb.put(params).promise().then(data => console.log(data.Attributes)).catch(console.error);
  }
};

/**
 * Edits user's total hours required. 
 *
 * @param event The APIGatewayProxyEvent for the API.
 * @returns The updated user object.
 */
 export const reductionApproval: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);

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
    const userList = await DynamoUtilities.queryDynamo(params, dynamoDb);

    if (userList.length != 1) {
      throw new Error(
        "DynamoDB query should have only 1 user per studentNumber"
      );
    }
    const user = userList[0];
    const newUser = user;
    newUser.hoursNeeded = parseFloat(newUser.hoursNeeded) - data.hourReduction;

    const params2 = {
      TableName: process.env.userTable,
      Item: newUser,
    };

    // dynamoDb.put(params2, (error, data) => {
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // });
    await dynamoDb.put(params2).promise().then(data => console.log(data.Attributes)).catch(console.error);

    return ResponseUtilities.apiResponse(userList[0], 200);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.apiResponse(err.message, 500);
  }
};
