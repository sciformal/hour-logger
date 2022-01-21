import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from '../types/database/User';
import { AdminType, UserType } from '../types/database/UserType';
import { DynamoUtilities } from './dynamo-utilities';

const dynamoDb = new DocumentClient();

export class UsersUtilities {
  public static uniqueStudentNumber = async (
    studentNumber: string,
  ): Promise<boolean> => {
    const params = {
      TableName: process.env.userTable,
      IndexName: 'StudentNumberIndex',
      KeyConditionExpression: 'studentNumber = :v_title',
      ExpressionAttributeValues: {
        ':v_title': studentNumber,
      },
      ScanIndexForward: false,
    };
    const userList = await DynamoUtilities.query(params, dynamoDb);
    if (userList.length !== 0) {
      return false;
    }
    return true;
  };

  public static totalHours = (userType: UserType): Partial<User> => {
    switch (userType) {
      case UserType.ENGINEER_ENROLLED:
        return {
          finalHoursNeeded: 10,
          regularHoursNeeded: 8,
        };
      case UserType.INTERNSHIP_KTOWN:
        return {
          finalHoursNeeded: 0,
          regularHoursNeeded: 5,
        };
      case UserType.INTERNSHIP:
        return {
          finalHoursNeeded: 0,
          regularHoursNeeded: 0,
        };
      case UserType.GUEST_QUEENS:
        return {
          finalHoursNeeded: 0,
          regularHoursNeeded: 5,
        };
      default:
        return {
          finalHoursNeeded: 0,
          regularHoursNeeded: 0,
        };
    }
  };

  public static adminLevel = (studentNumber): AdminType => {
    // TODO: Build in the sci formal managers here.
    if (studentNumber === '20066282') {
      return AdminType.ADMIN;
    }

    return AdminType.USER;
  };
}
