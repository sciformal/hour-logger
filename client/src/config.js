const apiUrl = 'https://' + process.env.REACT_APP_API_URL + '.execute-api.' + process.env.REACT_APP_REGION + '.amazonaws.com/' + process.env.REACT_APP_API_STAGE;


export const AmplifyConfig = {
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: apiUrl
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_COGNITO_USERPOOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COGNITO_APPCLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_COGNITO_IDENTITYPOOL_ID
  }
};