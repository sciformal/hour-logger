import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk";

export class DynamoUtilities {
  public static query(params: any, db: DocumentClient): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      db.query(params, (err: AWSError, data) => {
        if (err) {
          reject(new Error(err.message));
        } else if (data.Items == null) {
          reject(new Error("No item exists"));
        } else {
          resolve(data.Items);
        }
      });
    });
  }

  public static put(params: any, db: DocumentClient): Promise<any> {
    return new Promise((resolve, reject) => {
      db.put(params, (err: AWSError) => {
        console.log("Inside Put")
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(params.Item);
        }
      });
    });
  }

  public static get(params: any, db: DocumentClient): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(params, (err: AWSError, data: GetItemOutput) => {
        console.log(data);
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(data.Item);
        }
      });
    });
  }
}
