import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AmplifyConfig } from './config';
import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: AmplifyConfig.cognito.REGION,
      userPoolId: AmplifyConfig.cognito.USER_POOL_ID,
      identityPoolId: AmplifyConfig.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: AmplifyConfig.cognito.APP_CLIENT_ID
    },
    API: {
      endpoints: [
        {
          name: "lab-partner",
          endpoint: AmplifyConfig.apiGateway.URL,
          region: AmplifyConfig.apiGateway.REGION
        },
      ]
    }
  });

ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
