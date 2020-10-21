import { logger } from '../utils/logger';
import dotenv = require('dotenv');

export const init = () => {
  dotenv.config({ path: '.env' });

  if (!process.env.DOMAIN_NAME) {
    logger.error('No domain name. Set DOMAIN_NAME environment variable.');
    process.exit(1);
  }

  if (!process.env.DEFAULT_HOSTNAME) {
    logger.error('No default origin. Set DEFAULT_HOSTNAME environment variable.');
    process.exit(1);
  }

  if (!process.env.REDIS_URL) {
    logger.error('No redis connection string. Set REDIS_URL environment variable.');
    process.exit(1);
  }

  if (!process.env.IAM_TOKEN) {
    logger.error('No IAM token. Set IAM_TOKEN environment variable.');
    process.exit(1);
  }

  if (!process.env.IAM_ENDPOINT) {
    logger.error('No IAM endpoint string. Set IAM_ENDPOINT environment variable.');
    process.exit(1);
  }

  if (!process.env.COOKIE_EXPIRES_IN) {
    logger.error('No Max age for cookies. Set COOKIE_EXPIRES_IN environment variable.');
    process.exit(1);
  }

  if (!process.env.COOKIE_SECRET) {
    logger.error('No cookie secret string. Set COOKIE_SECRET environment variable.');
    process.exit(1);
  }

  let publicKey = process.env.JWT_PUBLIC_KEY;
  if (!publicKey) {
    logger.error('No public key. Set JWT_PUBLIC_KEY environment variable.');
    process.exit(1);
  } else if (publicKey.search(/\\n/gi) !== -1) {
    process.env.JWT_PUBLIC_KEY = JSON.parse(`"${publicKey}"`);
  }

  let privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    logger.error('No private key. Set JWT_PRIVATE_KEY environment variable.');
    process.exit(1);
  } else if (privateKey.search(/\\n/gi) !== -1) {
    process.env.JWT_PRIVATE_KEY = JSON.parse(`"${privateKey}"`);
  }
};
