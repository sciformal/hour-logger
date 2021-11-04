import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { DynamoUtilities } from '../util/dynamo';
import {
  ReductionRequest,
  ReductionStatus,
} from '../types/models/ReductionRequest';
import { ErrorConstants } from '../constants/errors';
import { ResponseUtilities } from '../util/response';

const dynamoDb = new DocumentClient();

export const create = async (
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

  if (!data.userId) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_USERID,
    );
  }

  const userId = data.userId;
  try {
    const params = {
      TableName: process.env.userTable,
      Key: {
        userId,
      },
    };
  
    const user = await DynamoUtilities.get(params, dynamoDb);
    if (!user) {
      // no user exists
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.DYNAMO_USERID_NOT_FOUND
      );
    }
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
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

  if (!data.message) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_REDUCTION_REQUEST_MESSAGE,
    );
  }

  const reductionRequestPayload: ReductionRequest = {
    ...data,
    requestId: uuid(),
    status: ReductionStatus.PENDING,
  };

  const params = {
    TableName: process.env.reductionRequestsTable,
    Item: reductionRequestPayload,
  };

  try {
    const reductionRequest = await DynamoUtilities.put(params, dynamoDb);
    return ResponseUtilities.createAPIResponse(reductionRequest);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const get = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.reductionRequestsTable,
  };

  try {
    const requests = await DynamoUtilities.scan(params, dynamoDb);
    return ResponseUtilities.createAPIResponse(requests);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
};

export const update = async (
  event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    if (!event.pathParameters) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.VALIDATION_PATH_MISSING,
      );
    }

    const { requestId } = event.pathParameters;

    if (!requestId) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.VALIDATION_BODY_REQUESTID,
      );
    } 
  
  if (!event.body) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_MISSING,
    );
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {     
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_INVALID,
    );
  }

  if (!data.status) {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STATUS,
    );
  }

  if (data.status == ReductionStatus.APPROVED) {
    if (!data.numHoursReduced) {
      return ResponseUtilities.createErrorResponse(
        ErrorConstants.VALIDATION_BODY_NUM_HOURS_REDUCED,
      );
    }
  } else if (data.status == ReductionStatus.DENIED) {
    // update the request to denied
    
  } else {
    return ResponseUtilities.createErrorResponse(
      ErrorConstants.VALIDATION_BODY_STATUS_INVALID,
    );
  }

  // check if requestId exists
  const params = {    
    TableName: process.env.reductionRequestsTable,
    Key: {
      requestId,
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

  const userId = request.userId;

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
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }

  const updatedUser = {
    ...user
  }

  const currHours = Number(updatedUser.hoursNeeded);
  const removal = Number(data.numHoursReduced);
  const newHours = currHours - removal;
  updatedUser.hoursNeeded = newHours

  // update the user in the table
  const updatedUserParams = {
    TableName: process.env.userTable,
    Item: updatedUser,
  }

  try {
    await DynamoUtilities.put(updatedUserParams, dynamoDb);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }

  const updatedRequestPayload = {
    ...request,
    status: data.status,
    numHoursReduced: data.numHoursReduced,
  }

  // update the request in the table
  const updatedRequestParams = {
    TableName: process.env.reductionRequestsTable,
    Item: updatedRequestPayload
  }

  try {
    const updatedRequest = await DynamoUtilities.put(updatedRequestParams, dynamoDb);
    return ResponseUtilities.createAPIResponse(updatedRequest);
  } catch (err) {
    console.log(err);
    return ResponseUtilities.createErrorResponse(err.message, 500);
  }
}

