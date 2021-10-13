import { HoursUtilities } from './../../src/util/hoursUtilities';
import { sampleTransaction } from './../mocks/hours';
import { DynamoUtilities } from "../../src/util/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ErrorConstants } from "../../src/constants/errors";
import { checkIn } from "../../src/handlers/hours";
import { sampleApiGatewayEvent } from "../mocks/event";
import { CheckInRequest } from "./../../src/types/requests/HoursRequest";
import { sampleStudentNumber, sampleUser } from "./../mocks/user";

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          put: jest.fn(),
          query: jest.fn(),
          get: jest.fn(),
        };
      }),
    },
  };
});

describe("Hours API Request", () => {
  describe("Check In Request", () => {
    const checkInRequest: CheckInRequest = {
      studentNumber: sampleStudentNumber,
    };

    const updatedUser = {...sampleUser, transactions : [sampleTransaction]};

    // resets valid reuqest on each call to new test
    let validRequest;
    beforeEach(() => {
      jest.spyOn(DynamoUtilities, "query").mockResolvedValue([sampleUser]);
      jest.spyOn(DynamoUtilities, "put").mockResolvedValue(sampleUser);
      jest.spyOn(HoursUtilities, "handleCheckInProcess").mockReturnValue(updatedUser);
      validRequest = {
        ...checkInRequest,
      };
    });

    // return 200 when everything works
    it("should return a 200 when updating user's checkin successfully", async () => {
        const mockEvent: APIGatewayProxyEvent = {
            ...sampleApiGatewayEvent,
            body: JSON.stringify(validRequest),
          };

          const response = await checkIn(mockEvent);
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual(
            JSON.stringify(updatedUser)
          );
    });

    it("should return 400 when the request doesnt contain a body", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING })
      );
    
    
    });

    it("should return 400 when the request body doesnt contain studentNumber", async () => {
      delete validRequest.studentNumber;

      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
        })
      );
    });

    it("should return 500 when Dynamo returns more than one student per student number", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };

      const userList = [sampleUser, sampleUser];
      jest.spyOn(DynamoUtilities, "query").mockResolvedValue(userList);

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.DYNAMO_NONUNIQUE_STUDENTNUMBER,
        })
      );
    });

    it("should return 500 when Dynamo fails to update the user", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validRequest),
      };
      const sampleErrorMessage = "sample error message";

      jest
        .spyOn(DynamoUtilities, "put")
        .mockRejectedValue(new Error(sampleErrorMessage));

      const response = await checkIn(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: sampleErrorMessage,
        })
      );
    });
  });
});