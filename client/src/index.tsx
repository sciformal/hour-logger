import { Amplify } from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { AmplifyConfig } from './config';
import './styles/index.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: AmplifyConfig.cognito.REGION,
    userPoolId: AmplifyConfig.cognito.USER_POOL_ID,
    identityPoolId: AmplifyConfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: AmplifyConfig.cognito.APP_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'hour-logger',
        endpoint: AmplifyConfig.apiGateway.URL,
        region: AmplifyConfig.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
