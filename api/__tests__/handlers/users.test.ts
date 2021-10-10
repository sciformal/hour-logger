import { ErrorConstants } from "../../src/constants/errors";
import { createUser } from "../../src/handlers/users";
import { sampleApiGatewayEvent } from "../mocks/event";
import { v4 as uuid } from "uuid";
import { UserRequest } from "../../src/types/requests/UserRequest";

function mockPromiseImplementation<T>(
  resolve: boolean = true,
  output: T = null,
  error: any = null
): () => { promise: () => Promise<T> } {
  return () => {
    return {
      promise: () => {
        if (resolve) {
          return Promise.resolve<T>(output);
        } else {
          return Promise.reject<any>(error);
        }
      },
    };
  };
}

function queryPromiseMock(): { promise: () => Promise<any> } {
  return mockPromiseImplementation()();
}

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          query: jest.fn().mockImplementation(() => queryPromiseMock()),
        };
      }),
    },
  };
});

describe("User Endpoint Tests", () => {
  const sampleUserId = uuid();
  let sampleUserRequest: UserRequest = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@queensu.ca",
    studentNumber: "000000000000",
    userId: sampleUserId,
  };

  let validUser: Partial<UserRequest>;

  beforeEach(() => {
    validUser = {
      ...sampleUserRequest,
    };
  });

  describe("Validation Tests", () => {
    it("should return 400 when the request doesnt contain a body", () => {
      const mockEvent = {
        ...sampleApiGatewayEvent,
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_MISSING })
      );
    });

    it("should return 400 when the request body doesnt contain firstName", () => {
      delete validUser.firstName;

      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_FIRSTNAME })
      );
    });

    it("should return 400 when the request body doesnt contain lastName", () => {
      delete validUser.lastName;

      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_LASTNAME })
      );
    });

    it("should return 400 when the request body doesnt contain email", () => {
      delete validUser.email;

      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_EMAIL })
      );
    });

    it("should return 400 when the request body doesnt contain studentNumber", () => {
      delete validUser.studentNumber;

      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: ErrorConstants.VALIDATION_BODY_STUDENTNUMBER,
        })
      );
    });

    it("should return 400 when the request body doesnt contain userId", () => {
      delete validUser.userId;

      const mockEvent = {
        ...sampleApiGatewayEvent,
        body: JSON.stringify(validUser),
      };

      const response = createUser(mockEvent);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        JSON.stringify({ message: ErrorConstants.VALIDATION_BODY_USERID })
      );
    });
  });
});
