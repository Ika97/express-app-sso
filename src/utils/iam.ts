import axios, { AxiosError } from 'axios';
import { isEmpty } from './misc';
import * as validator from 'validator';

const instance = axios.create({
  baseURL: process.env.IAM_ENDPOINT + '/middleware/',
  headers: {
    'Content-Type': 'application/json',
    TOKEN: process.env.IAM_TOKEN
  }
});

interface IamError extends Error {
  status: string | number;
  message: string;
  data?: {};
}

export interface ILogin {
  snaid: string;
}

export interface IRequestAccess {
  success: boolean;
  email?: string;
  token?: string;
}

/**
 * Make a request to IAM to authenticate the user with the given username and password
 * @param username string
 * @param password string
 */
export const login = async (username: string, password: string): Promise<ILogin | IamError> => {
  const encodedUsername = new Buffer(username).toString('base64');
  const encodedPassword = new Buffer(password).toString('base64');
  try {
    let snaid = null;
    const res = await instance.get(`customer/username/${encodedUsername}/password/${encodedPassword}`);
    if (res.status === 200 && res.data.customerNumber) {
      snaid = res.data.customerNumber;
    }
    return { snaid: snaid };
  } catch (err) {
    throw getError(err);
  }
};

/**
 * Make a request to IAM to start the account recovery process with the given email address
 * @param email string
 */
export const recoverPassword = async (email: string): Promise<IRequestAccess | IamError> => {
  try {
    const res = await instance.post('request/access', { email: email });
    return { success: (res.status === 200 && res.data.status === 'OK' && res.data.errorCode === 0) };
  } catch (err) {
    throw getError(err);
  }
};

/**
 * Make a request to IAM to reset the password of a username with the given password, token and username
 * @param password string
 * @param token string
 * @param username string
 */
export const resetPassword = async (
  password: string,
  token: string,
  username: string
): Promise<IRequestAccess | IamError> => {
  try {
    const res = await instance.post('request/access/process', {
      password: password,
      token: token,
      username: username
    });
    return { success: (res.status === 200 && res.data.status === 'OK' && res.data.errorCode === 0) };
  } catch (err) {
    throw getError(err);
  }
};

/**
 * Make a request to IAM to validate the token the user has given in either a get or post request
 * @param token string
 */
export const validateToken = async (token: string): Promise<IRequestAccess | IamError> => {
  if (validator.isEmpty(token)) {
    return { success: false };
  }
  try {
    const res = await instance.post('request/access/validate', { token: token });

    if (res.status !== 200) {
      return { success: false };
    }
    if (isEmpty(res.data)) {
      return { success: false };
    }
    if (res.data['apiToken'] !== token) {
      return { success: false };
    }
    if (res.data['notes'] instanceof String) {
      switch (res.data['notes']) {
        case 'UNKNOWN_TOKEN':
          return { success: false };
        case 'TOKEN_EXPIRED':
          return { success: false };
        case 'NO_ACCOUNT':
          return { success: false };
        default:
          return { success: false };
      }
    }
    return { success: true, email: res.data['email'], token: res.data['apiToken'] };
  } catch (err) {
    throw getError(err);
  }
};

/**
 * Determines and then returns the error that occurred with the request.
 * This is inspired by the code found here: https://github.com/axios/axios#handling-errors
 * @param error Error object
 */
const getError = (error: AxiosError): IamError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      name: error.name,
      status: error.response.status,
      message: 'IAM Service: Bad response',
      data: {
        headers: error.response.headers
      }
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return {
      name: error.name,
      status: null,
      message: 'IAM service: No response',
      data: {
        request: error.request
      }
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      name: error.name,
      status: null,
      message: 'IAM service: Bad request',
      data: {
        error: error.message
      }
    };
  }
};
