import { ErrorConstants } from "../../src/constants/errors";
import { create, get } from "../../src/handlers/users";
import { sampleApiGatewayEvent } from "../mocks/event";
import { UserRequest } from "../../src/types/requests/UserRequest";
import { DynamoUtilities } from "../../src/util/dynamo";
import { sampleUser, sampleUserId, sampleUserRequest } from "../mocks/user";
import { APIGatewayProxyEvent } from "aws-lambda";

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

describe("User Endpoint Tests", () => {
  describe("Create User Tests", () => {

    let validUser: Partial<UserRequest>;

    beforeEach(() => {
      validUser = {
        ...sampleUserRequest,
      };
    });

    it("should return a 200 when creating a user successfully", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      jest.spyOn(DynamoUtilities, "put").mockResolvedValue(sampleUser);

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });


    it("should throw a 500 when DynamoDB fails", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const errMessage = "failed to put in dynamo";

      jest.spyOn(DynamoUtilities, "put").mockRejectedValue(new Error(errMessage));

      const response = await create(mockEvent);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(JSON.stringify({ message: errMessage }));
    });

    describe("Validation Tests", () => {
      it("should return 400 when the request doesnt contain a body", async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING })
        );
      });

      it("should return 400 when the request doesnt contain a body", async () => {
        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: "this cannot be parsed!"
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_INVALID })
        );
      });

      it("should return 400 when the request body doesnt contain firstName", async () => {
        delete validUser.firstName;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_FIRSTNAME })
        );
      });

      it("should return 400 when the request body doesnt contain lastName", async () => {
        delete validUser.lastName;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_LASTNAME })
        );
      });

      it("should return 400 when the request body doesnt contain email", async () => {
        delete validUser.email;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_EMAIL })
        );
      });

      it("should return 400 when the request body doesnt contain studentNumber", async () => {
        delete validUser.studentNumber;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
          })
        );
      });

      it("should return 400 when the request body doesnt contain userId", async () => {
        delete validUser.userId;

        const mockEvent: APIGatewayProxyEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await create(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_USERID })
        );
      });
    });
  });

  describe("Get User Tests", () => {

    it("should return a 200 when getting a user successfully", async () => {
      const mockEvent: APIGatewayProxyEvent = {
        ...sampleApiGatewayEvent,
        pathParameters: {
          userId: sampleUserId
        }
      }
      
      jest.spyOn(DynamoUtilities, "get").mockResolvedValue(sampleUser);

      const response = await get(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });
  });

  it("should return a 400 when no path parameters", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      ...sampleApiGatewayEvent,
      pathParameters: {
      }
    }
    
    const response = await get(mockEvent);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(JSON.stringify({ message: ErrorConstants.VALIDATION_PATH_MISSING }));
  });

  it("should throw a 500 when DynamoDB fails", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      ...sampleApiGatewayEvent,
      pathParameters: {
        userId: sampleUserId
      }
    };

    const errMessage = "failed to put in dynamo";

    jest.spyOn(DynamoUtilities, "get").mockRejectedValue(new Error(errMessage));

    const response = await get(mockEvent);
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(JSON.stringify({ message: errMessage }));
  });
});
