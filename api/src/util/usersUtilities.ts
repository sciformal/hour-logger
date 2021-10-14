import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { bool } from 'aws-sdk/clients/signer';
import { DynamoUtilities } from './dynamo';

const dynamoDb = new DocumentClient();

export class UsersUtilities {
   public static uniqueStudentNumber =  async (studentNumber: string): Promise<boolean> => {
    
    const params = {
      TableName: process.env.userTable,
      IndexName: "StudentNumberIndex",
      KeyConditionExpression: "studentNumber = :v_title",
      ExpressionAttributeValues: {
        ":v_title": studentNumber,
      },
      ScanIndexForward: false,
    };
    const userList = await DynamoUtilities.query(params, dynamoDb);
    if(userList.length != 0) {
        return false;
    }
    return true
  };
}

