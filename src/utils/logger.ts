require('colors'); // tslint:disable-line:no-var-requires
import { createLogger, format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = isProduction ? 'error' : 'debug';
export const logger = createLogger({
  exitOnError: false,
  format: format.simple(),
  transports: [new transports.Console({ level: logLevel })]
});

logger.info('Initialized logging (level: ' + logLevel + ')');
