import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoUtilities } from './dynamo-utilities';
import { UserSituation } from '../types/models/UserType';
import { User } from '../types/models/User';

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

  public static totalHours = (userSituation: UserSituation): Partial<User> => {
    if (userSituation === UserSituation.ENGINEER_ENROLLED) {
      return {
        finalHoursNeeded: 10,
        regularHoursNeeded: 8,
      };
    }
    if (userSituation === UserSituation.INTERNSHIP_KTOWN) {
      return {
        finalHoursNeeded: 0,
        regularHoursNeeded: 5,
      };
    }
    if (userSituation === UserSituation.INTERNSHIP) {
      return {
        finalHoursNeeded: 0,
        regularHoursNeeded: 0,
      };
    }
    if (userSituation === UserSituation.GUEST_QUEENS) {
      return {
        finalHoursNeeded: 0,
        regularHoursNeeded: 5,
      };
    }
    if (userSituation === UserSituation.GUEST) {
      return {
        finalHoursNeeded: 0,
        regularHoursNeeded: 0,
      };
    }
    return {
      finalHoursNeeded: 0,
      regularHoursNeeded: 0,
    };
  };
}
