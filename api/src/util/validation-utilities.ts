import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ErrorConstants } from '../constants/errors';
import { RequestStatus } from '../types/database/ReductionRequest';
import { RequestType } from '../types/requests/Request';

/**
 * Utility Class to validate API Events.
 */
export class ValidationUtilities {
  /**
   * Validate the POST /requests endpoint.
   *
   * @param event   The API Gateway event object.
   * @returns       The validated request object.
   */
  public static validateCreateRequestFields(event) {
    if (!event.body) {
      throw Error(ErrorConstants.VALIDATION_BODY_MISSING);
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log(err);
      throw Error(ErrorConstants.VALIDATION_BODY_INVALID);
    }

    if (!data.userId) {
      throw Error(ErrorConstants.createValidationString('userId'));
    }

    if (!data.message) {
      throw Error(ErrorConstants.createValidationString('message'));
    }

    if (!data.type) {
      throw Error(ErrorConstants.createValidationString('type'));
    }

    if (
      data.type !== RequestType.TRANSFER.toString() &&
      data.type !== RequestType.REDUCTION.toString()
    ) {
      throw Error(ErrorConstants.VALIDATION_BODY_TYPE_INVALID);
    }

    if (data.type === RequestType.TRANSFER) {
      if (!data.toUserId) {
        throw Error(ErrorConstants.createValidationString('toUserId'));
      }

      if (!data.numHours) {
        throw Error(ErrorConstants.createValidationString('numHours'));
      }
    }
    return data;
  }

  /**
   * Validate the PUT /requests/{requestId} endpoint.
   *
   * @param event   The API Gateway event object.
   * @returns       The validated request object.
   */
  public static validateUpdateRequestFields(event) {
    if (!event.pathParameters) {
      throw Error(ErrorConstants.VALIDATION_PATH_MISSING);
    }

    const { requestId } = event.pathParameters;

    if (!requestId) {
      throw Error(ErrorConstants.VALIDATION_PATH_INVALID);
    }

    if (!event.body) {
      throw Error(ErrorConstants.VALIDATION_BODY_MISSING);
    }

    let data;
    try {
      data = JSON.parse(event.body);
      data.requestId = requestId;
    } catch (err) {
      throw Error(ErrorConstants.VALIDATION_BODY_INVALID);
    }

    if (!data.status) {
      throw Error(ErrorConstants.createValidationString('status'));
    }

    if (
      data.status === RequestStatus.APPROVED ||
      data.status === RequestStatus.DENIED
    ) {
      if (data.status === RequestStatus.APPROVED && !data.numHours) {
        throw Error(ErrorConstants.createValidationString('numHours'));
      }
    } else {
      throw Error(ErrorConstants.VALIDATION_BODY_STATUS_INVALID);
    }

    return data;
  }

  /**
   * Validate that a request exists.
   *
   * @param requestId The requestId to validate.
   */
  public static validateRequestExists(
    requestId: string,
    dynamoDb: DocumentClient,
  ) {
    const params = {
      TableName: process.env.requestsTable,
      Key: {
        requestId,
      },
    };
  }
}
