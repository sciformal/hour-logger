import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { ErrorConstants } from '../constants/errors';
import {
  RequestDTO,
  RequestStatus,
  RequestType,
} from '../types/database/Request';
import { UserDTO } from '../types/database/User';
import { UpdateRequest, BaseRequest } from '../types/interface/Request';
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
  // Validate request payload
  let validatedData: BaseRequest;
  try {
    validatedData = ValidationUtilities.validateCreateRequestFields(event);
  } catch (e) {
    console.log(e);
    return ResponseUtilities.createErrorResponse(e.message, 400);
  }

  // Validate that the user exists
  let user: UserDTO;
  try {
    const userParams = {
      TableName: process.env.userTable,
      Key: {
        userId: validatedData.userId,
      },
    };
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

  // Put the request is in the database
  try {
    const databasePayload: RequestDTO = {
      ...validatedData,
      requestId: uuid(),
      status: RequestStatus.PENDING,
      date: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.requestsTable,
      Item: databasePayload,
    };

    const reductionRequest: RequestDTO = await DynamoUtilities.put(
      params,
      dynamoDb,
    );
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

  // Get the request from the database
  try {
    const requests = await DynamoUtilities.scan(params, dynamoDb);
    return ResponseUtilities.createSuccessResponse(requests);
  } catch (err) {
    console.log(err);
    console.log('[requests.ts:L90');
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const update = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Validate request payload
  let validatedData: UpdateRequest;
  try {
    validatedData = ValidationUtilities.validateUpdateRequestFields(event);
  } catch (e) {
    console.log(e);
    return ResponseUtilities.createErrorResponse(e.message, 400);
  }

  // get the request from the database
  let request;
  try {
    const params = {
      TableName: process.env.requestsTable,
      Key: {
        requestId: validatedData.requestId,
      },
    };
    request = await DynamoUtilities.get(params, dynamoDb);
    if (!request) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.DYNAMO_REQUESTID_NOT_FOUND,
      );
    }
  } catch (err) {
    console.log(err);
    console.log('[requests.ts:L126');
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }

  // handle rejection flow
  if (validatedData.status === RequestStatus.DENIED) {
    // update the request object
    try {
      const updatedRequestPayload = {
        ...request,
        status: validatedData.status,
        numHours: 0,
      };

      const updatedRequestParams = {
        TableName: process.env.requestsTable,
        Item: updatedRequestPayload,
      };

      const updatedRequest = await DynamoUtilities.put(
        updatedRequestParams,
        dynamoDb,
      );
      return ResponseUtilities.createSuccessResponse(updatedRequest);
    } catch (err) {
      console.log(err);
      console.log('[requests.ts:L151');
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }
  } else {
    // handle updating user for reduction requests
    if (request.type === RequestType.REDUCTION) {
      const { userId } = request;

      // get the user from the user table
      let user: UserDTO;
      try {
        const userParams = {
          TableName: process.env.userTable,
          Key: {
            userId,
          },
        };
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

      // TODO: Think about application logic here.
      // TODO: How we want to handle final week hours?
      // TOOD: when does final hours week start?
      const currHours = Number(user.regularHoursNeeded);
      const removal = Number(validatedData.numHours);
      let newHours = currHours - removal;

      if (newHours < 0) {
        newHours = 0;
      }

      const updatedUser = {
        ...user,
        regularHoursNeeded: newHours,
      };

      // update the user in the table
      const updatedUserParams = {
        TableName: process.env.userTable,
        Item: updatedUser,
      };

      try {
        await DynamoUtilities.put(updatedUserParams, dynamoDb);
      } catch (err) {
        console.log(err);
        console.log('requests.ts - L206');
        return ResponseUtilities.createErrorResponse(err.message, 500);
      }
    } else {
      const { userId, toUserId } = request;

      // pull in the users
      let user: UserDTO;
      let toUser: UserDTO;
      try {
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

        user = await DynamoUtilities.get(userParams, dynamoDb);
        if (!user) {
          return ResponseUtilities.createErrorResponse(
            ErrorConstants.DYNAMO_USERID_NOT_FOUND,
          );
        }
        toUser = await DynamoUtilities.get(toUserParams, dynamoDb);
        if (!toUser) {
          return ResponseUtilities.createErrorResponse(
            ErrorConstants.DYNAMO_USERID_NOT_FOUND,
          );
        }
      } catch (err) {
        console.log(err);
        console.log('[requests.ts]:L243');
        return ResponseUtilities.createErrorResponse(err.message, 500);
      }

      const currUserHours = Number(user.hours || 0);
      const currToUserHours = Number(toUser.hours || 0);
      const removalHours = Number(validatedData.numHours);

      const newHoursUser = currUserHours - removalHours;
      const newHoursToUser = currToUserHours + removalHours;

      const updatedUser: UserDTO = {
        ...user,
        hours: newHoursUser,
      };

      const updatedToUser: UserDTO = {
        ...toUser,
        hours: newHoursToUser,
      };

      try {
        // update the user in the table
        const updatedUserParams = {
          TableName: process.env.userTable,
          Item: updatedUser,
        };

        const updatedToUserParams = {
          TableName: process.env.userTable,
          Item: updatedToUser,
        };
        await DynamoUtilities.put(updatedUserParams, dynamoDb);
        await DynamoUtilities.put(updatedToUserParams, dynamoDb);
      } catch (err) {
        console.log(err);
        console.log('[requests.ts]:L279');
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
      console.log('[requests.ts:L300');
      return ResponseUtilities.createErrorResponse(err.message, 500);
    }
  }
};
