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
