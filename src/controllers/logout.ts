import { Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * GET /logout
 * Logs the user out of their current session and redirects them back to the home `/` page
 * @param req express request object
 * @param res express response object
 */
export const getLogout = (req: Request, res: Response) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      logger.error('Error : Failed to destroy the session during logout.', err);
    }
    req.user = null;
    return res.redirect(302, '/');
  });
};
