import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { ErrorConstants } from '../constants/errors';
import {
  RequestModel,
  RequestStatus,
} from '../types/database/ReductionRequest';
import { RequestType } from '../types/requests/Request';
import { DynamoUtilities } from '../util/dynamo-utilities';
import { ResponseUtilities } from '../util/response-utilities';
import { ValidationUtilities } from '../util/validation-utilities';

const dynamoDb = new DocumentClient();

/**
 * Handler for the POST /requests endpoint.
 * Creates a new reduction request in the DynamoDB table.
 *
 * @param event   The API Gateway event object.
 * @returns       The request object in the DynamoDB table.
 */
export const create = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let validatedData;

  // Validate request payload
  try {
    validatedData = ValidationUtilities.validateCreateRequestFields(event);
  } catch (e) {
    console.log(e);
    return ResponseUtilities.createErrorResponse(e.message, 400);
  }

  // Validate that the user exists
  let user;
  const userParams = {
    TableName: process.env.userTable,
    Key: {
      userId: validatedData.userId,
    },
  };

  try {
    user = await DynamoUtilities.get(userParams, dynamoDb);
    if (!user) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.DYNAMO_USERID_NOT_FOUND,
      );
    }
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }

  const databasePayload: RequestModel = {
    ...validatedData,
    requestId: uuid(),
    status: RequestStatus.PENDING,
    date: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.requestsTable,
    Item: databasePayload,
  };

  try {
    const reductionRequest = await DynamoUtilities.put(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(reductionRequest);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const get = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.requestsTable,
  };

  try {
    const requests = await DynamoUtilities.scan(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(requests);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const update = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let validatedData;

  // Validate request payload
  try {
    validatedData = ValidationUtilities.validateUpdateRequestFields(event);
  } catch (e) {
    console.log(e);
    return ResponseUtilities.createErrorResponse(e.message, 400);
  }

  // check if requestId exists
  const params = {
    TableName: process.env.requestsTable,
    Key: {
      requestId: validatedData.requestId,
    },
  };

  let request;

  try {
    request = await DynamoUtilities.get(params, dynamoDb);
    if (!request) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.DYNAMO_REQUESTID_NOT_FOUND,
      );
    }
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }

  if (validatedData.status === RequestStatus.DENIED) {
    // update and return;
    const updatedRequestPayload = {
      ...request,
      status: validatedData.status,
      numHours: 0,
    };

    // update the request in the table
    const updatedRequestParams = {
      TableName: process.env.requestsTable,
      Item: updatedRequestPayload,
    };

    try {
      const updatedRequest = await DynamoUtilities.put(
        updatedRequestParams,
        dynamoDb,
      );
      return ResponseUtilities.createSuccessResponse(updatedRequest);
    } catch (err) {
      console.log(err);
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }
  }

  if (request.type === RequestType.REDUCTION) {
    console.log(request);
    const { userId } = request;

    // pull in the user
    const userParams = {
      TableName: process.env.userTable,
      Key: {
        userId,
      },
    };

    let user;

    try {
      user = await DynamoUtilities.get(userParams, dynamoDb);
      if (!user) {
        return ResponseUtilities.createErrorResponse(
          ErrorConstants.DYNAMO_USERID_NOT_FOUND,
        );
      }
    } catch (err) {
      console.log(err);
      console.log('requests.ts - L177');
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }

    const updatedUser = {
      ...user,
    };

    const currHours = Number(updatedUser.regularHoursNeeded);
    const removal = Number(validatedData.numHours);
    let newHours = currHours - removal;

    if (newHours < 0) {
      newHours = 0;
    }

    updatedUser.regularHoursNeeded = newHours;

    // update the user in the table
    const updatedUserParams = {
      TableName: process.env.userTable,
      Item: updatedUser,
    };

    try {
      await DynamoUtilities.put(updatedUserParams, dynamoDb);
    } catch (err) {
      console.log(err);
      console.log(updatedUserParams);
      console.log('requests.ts - L206');
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }
  } else {
    const { userId, toUserId } = request;

    // pull in the user
    const userParams = {
      TableName: process.env.userTable,
      Key: {
        userId,
      },
    };

    const toUserParams = {
      TableName: process.env.userTable,
      Key: {
        userId: toUserId,
      },
    };

    let user;
    let toUser;

    try {
      user = await DynamoUtilities.get(userParams, dynamoDb);
      toUser = await DynamoUtilities.get(toUserParams, dynamoDb);
      if (!user) {
        return ResponseUtilities.createErrorResponse(
          ErrorConstants.DYNAMO_USERID_NOT_FOUND,
        );
      }
    } catch (err) {
      console.log(err);
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }

    const updatedUser = {
      ...user,
    };

    const updatedToUser = {
      ...toUser,
    };

    const currUserHours = Number(updatedUser.hours);
    const currToUserHours = Number(updatedToUser.hours);
    const removalHours = Number(validatedData.numHours);

    const newHoursUser = currUserHours - removalHours;
    const newHoursToUser = currToUserHours + removalHours;

    updatedUser.hours = newHoursUser;
    updatedToUser.hours = newHoursToUser;

    // update the user in the table
    const updatedUserParams = {
      TableName: process.env.userTable,
      Item: updatedUser,
    };

    const updatedToUserParams = {
      TableName: process.env.userTable,
      Item: updatedToUser,
    };

    try {
      await DynamoUtilities.put(updatedUserParams, dynamoDb);
      await DynamoUtilities.put(updatedToUserParams, dynamoDb);
    } catch (err) {
      console.log(err);
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }
  }

  const updatedRequestPayload = {
    ...request,
    status: validatedData.status,
    numHours: Number(validatedData.numHours),
  };

  // update the request in the table
  const updatedRequestParams = {
    TableName: process.env.requestsTable,
    Item: updatedRequestPayload,
  };

  try {
    const updatedRequest = await DynamoUtilities.put(
      updatedRequestParams,
      dynamoDb,
    );
    return ResponseUtilities.createSuccessResponse(updatedRequest);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};
