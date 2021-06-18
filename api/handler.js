export const create = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Creating a user!',
      },
      null,
      2
    ),
  };
};

export const me = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Fetching current user information!',
      },
      null,
      2
    ),
  };
};

export const hours = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Getting user hours!',
      },
      null,
      2
    ),
  };
};

export const editHours = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Updating user hours!',
      },
      null,
      2
    ),
  };
};

export const payment = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Processing payment!',
      },
      null,
      2
    ),
  };
};