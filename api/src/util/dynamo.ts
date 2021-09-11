import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { AWSError } from "aws-sdk";

export class DynamoUtilities {
    public static queryDynamo(params: any, db: DocumentClient): Promise<Array<any>> {
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

    // public static updateDynamo(params: any, db: DocumentClient): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         db.put(params, (err: AWSError, data) => {
    //             if (err) {
    //                 reject(new Error(err.message));
    //             } else {
    //                 resolve(*"s);
    //             }
    //         });
    //     })
    // }
}