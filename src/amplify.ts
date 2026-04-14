import { Amplify } from 'aws-amplify';

// This connects the app to the correct Cognito user pool before anything else runs.


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    },
  },
});