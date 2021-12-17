# Sci Formal Hour Logger

[![Netlify Status](https://api.netlify.com/api/v1/badges/b38d20a2-4d51-462f-8ad4-5a6195265827/deploy-status)](https://app.netlify.com/sites/hour-logger/deploys)

The Hour Logger is a web-based application built for the Sci' Formal committee to track student hours in contributing to preparing for the event.

More information about the event can be found at [scienceformal.ca](https://scienceformal.ca).

## Frontend

The frontend for the Sci' Formal Hour Logger is built in TypeScript with React. The React App is bootstrapped with CRA and can be found in the `client/` folder. Some of the main features include:

- Hour Tracking

  - See how many hours have been completed and how many remain
  - Request to have your hours reduced
  - Request to transfer your hours to someone else

- User Management

  - Check in/out a user
  - Search users, manually edit hours
  - Manage requests to reduce and transfer hours

- Authentication using AWS Cognito

## Backend

The backend of the application is a Serverless API using DynamoDB for persisting data. This is implemented as a REST API through managed API GateWay.

## Getting Started

### 1. Clone The Repository

```
git clone https://github.com/sciformal/hour-logger.git
cd hour-logger
yarn
```

### 2. Configure a local environment

#### 2.1 Deploy a local API

Navigate to the `api` directory and configure the serverless project:

```
cd api
cp .env.example .env
```

Update the .env file with your own values.

Next, deploy the API:

```
sls deploy
```

#### 2.2 Run the client

Navigate to the `client` directory and configure the React project:

```
cd client
cp .env.example .env
```

Update the .env file with your own values.

Next, start the React app:

```
yarn            // install dependencies
yarn start      // start the app
```

## Authors

- [Brent Champion](https://github.com/bchampp)
- [Ava Little](https://github.com/avalittle)

## License

This project is licensed under the MIT [License](./LICENSE).
