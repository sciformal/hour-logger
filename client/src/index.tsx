import React from 'react';
import ReactDOM from 'react-dom';
import { AmplifyConfig } from './config';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
