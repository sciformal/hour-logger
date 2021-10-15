import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Sample APIGatewayProxyEvent to mock request data.
 */
export const sampleApiGatewayEvent: APIGatewayProxyEvent = {
  body: null,
  headers: {
    'User-Agent': 'sample-user-agent',
    'X-Forwarded-For': 'sample-x-forwarded-for',
  },
  httpMethod: 'sample-http-method',
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  path: '',
  pathParameters: null,
  queryStringParameters: null,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: null,
    domainName: 'sample-domain-name',
    httpMethod: 'sample-http-method',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: 'sample-source-ip',
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: 'sample-path',
    protocol: 'sample-protocol',
    requestId: 'sample-request-id',
    requestTimeEpoch: 0,
    resourceId: 'sample-resource-id',
    resourcePath: 'sample-resource-path',
    stage: 'sample-stage',
  },
  resource: '',
  stageVariables: null,
};
