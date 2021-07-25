/**
 * Main entry point for all users endpoints.
 */

 import AWS from "aws-sdk";
 import { v4 } from "uuid";
 
 const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
 export function main(event, context, callback) {
   // Request body is passed in as a JSON encoded string in 'event.body'
   const data = JSON.parse(event.body);
 
   if (!data) {
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
     const response = {
       statusCode: 400,
       headers: headers,
       body: JSON.stringify({
         message: "Body was not passed in the request!",
       }),
     };
     callback(null, response);
   }
   if (!data.firstName) {
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
     const response = {
       statusCode: 400,
       headers: headers,
       body: JSON.stringify({
         message: "firstName was not passed in the request!",
       }),
     };
     callback(null, response);
   }
   if (!data.lastName) {
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
     const response = {
       statusCode: 400,
       headers: headers,
       body: JSON.stringify({
         message: "lastName was not passed in the request!",
       }),
     };
     callback(null, response);
   }
   if (!data.email) {
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
     const response = {
       statusCode: 400,
       headers: headers,
       body: JSON.stringify({
         message: "email was not passed in the request!",
       }),
     };
     callback(null, response);
   }
   if (!data.studentNumber) {
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
     const response = {
       statusCode: 400,
       headers: headers,
       body: JSON.stringify({
         message: "school was not passed in the request!",
       }),
     };
     callback(null, response);
   }

   console.log(process.env.userTable)
 
   const params = {
     TableName: process.env.userTable,
     Item: {
       userId: v4(),
       firstName: data.firstName,
       lastName: data.lastName,
       email: data.email,
       studentNumber: data.studentNumber,
       hours: 0, // not sure about this
     },
   };
 
   dynamoDb.put(params, (error, data) => {
     // Set response headers to enable CORS (Cross-Origin Resource Sharing)
     const headers = {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Credentials": true,
     };
 
     // Return status code 500 on error
     if (error) {
       const response = {
         statusCode: 500,
         headers: headers,
         body: JSON.stringify({ error }),
       };
       callback(null, response);
       return;
     }
 
     // Return status code 200 and the newly created item
     const response = {
       statusCode: 200,
       headers: headers,
       body: JSON.stringify(params.Item),
     };
     callback(null, response);
   });
 }