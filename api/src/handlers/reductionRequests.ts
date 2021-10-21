import { DynamoUtilities } from '../util/dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ReductionRequest, ReductionStatus } from '../types/ReductionRequest';
import { ErrorConstants } from '../constants/errors';
import { ResponseUtilities } from '../util/response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DocumentClient();

export const newRequest = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return ResponseUtilities.createErrorResponse(
          ErrorConstants.VALIDATION_BODY_MISSING,
        );
    }
    const data = JSON.parse(event.body);
    if (!data.userId) {
        return ResponseUtilities.createErrorResponse(
          ErrorConstants.VALIDATION_BODY_USERID,
        );
    }
    if (!data.reductionMessage) {
        return ResponseUtilities.createErrorResponse(
          ErrorConstants.VALIDATION_BODY_REDUCTION_REQUEST_MESSAGE,
        );
    }
    const reductionRequestPayload: ReductionRequest = {
        ...data,
        requestId: uuidv4(),
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