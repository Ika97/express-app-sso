import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { logger } from './logger';

/**
 * Generate an encrypted token to send back to the requesting application
 * @param payload object of data to encrypt in the token
 * @param req express request object
 */
export const generateToken = (payload: object, req: Request) => {
  let _privateKey = process.env.JWT_PRIVATE_KEY;
  let _algorithm = process.env.JWT_ALGORITHM || 'RS512';
  let _expires = process.env.JWT_EXPIRES_IN || '1d';
  if (typeof payload !== 'object') { return; }

  try {
    const token = jwt.sign(payload, _privateKey, { algorithm: _algorithm, expiresIn: _expires });
    return token;
  } catch (error) {
    logger.error('JWT SIGN ERROR', error);
    return;
  }
};
