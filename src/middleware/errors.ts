import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * app's default error handler
 */
export const errorHandler = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error has occurred');
    if (err.code === 'EBADCSRFTOKEN') {
      // handle CSRF token errors here
      res.locals.messages = {
        error: ['Invalid CSRF Token, please try again'],
        username: [req.body.username || ''],
        password: [req.body.password || '']
      };
      return res.render('login', {
        title: 'Login - Stansberry Research',
        _csrf: req.csrfToken(),
        action: req.originalUrl
      });
    }
    res.status(500);
    return res.render('error', {
      title: '500: Internal Error',
      error: err.message
    });
  };
};

/**
 * Check that the user has a session, if they do not display the error page
 */
export const checkSession = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      return res.render('error', {
        title: '500: Session Error',
        error: 'Session Error: connection to Redis is likely the issue'
      });
    }
    next();
  };
};

/**
 * Render the error page, this is called when no other page is found
 * @param req express request object
 * @param res express response object
 */
export const displayError = (req: Request, res: Response) => {
  res.render('error', {
    title: '404: Not found',
    error: 'The page you are looking for does not exist'
  });
};
