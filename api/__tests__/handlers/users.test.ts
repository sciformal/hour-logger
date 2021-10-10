import { ErrorConstants } from "../../src/constants/errors";
import { createUser, getUser } from "../../src/handlers/users";
import { sampleApiGatewayEvent } from "../mocks/event";
import { UserRequest } from "../../src/types/requests/UserRequest";
import { DynamoUtilities } from "../../src/util/dynamo";
import { sampleUser, sampleUserId, sampleUserRequest } from "../mocks/user";

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

    it("should create a user successfully", async () => {
      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      jest.spyOn(DynamoUtilities, "put").mockResolvedValue(sampleUser);

      const response = await createUser(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });

    describe("Validation Tests", () => {
      it("should return 400 when the request doesnt contain a body", async () => {
        const mockEvent = {
          ...sampleApiGatewayEvent,
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING })
        );
      });

      it("should return 400 when the request body doesnt contain firstName", async () => {
        delete validUser.firstName;

        const mockEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_FIRSTNAME })
        );
      });

      it("should return 400 when the request body doesnt contain lastName", async () => {
        delete validUser.lastName;

        const mockEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_LASTNAME })
        );
      });

      it("should return 400 when the request body doesnt contain email", async () => {
        delete validUser.email;

        const mockEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_EMAIL })
        );
      });

      it("should return 400 when the request body doesnt contain studentNumber", async () => {
        delete validUser.studentNumber;

        const mockEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({
            message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
          })
        );
      });

      it("should return 400 when the request body doesnt contain userId", async () => {
        delete validUser.userId;

        const mockEvent = {
          ...sampleApiGatewayEvent,
          body: JSON.stringify(validUser),
        };

        const response = await createUser(mockEvent);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(
          JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_USERID })
        );
      });
    });
  });

  describe("Get User Tests", () => {

    it("should get a user successfully", async () => {
      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify({userId: sampleUserId})
      }
      
      jest.spyOn(DynamoUtilities, "get").mockResolvedValue(sampleUser);

      const response = await getUser(mockEvent);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify(sampleUser));
    });
  });
});
