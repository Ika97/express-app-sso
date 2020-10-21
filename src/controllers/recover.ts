import { Request, Response } from 'express';
import * as validator from 'validator';
import { recoverPassword } from '../utils/iam';

/**
 * GET /recover
 * Renders the recover page to begin the user recover process
 * @param req express request object
 * @param res express response object
 */
export const getRecover = (req: Request, res: Response) => {
  return res.render('recover', {
    title: 'Recover Password - Stansberry Research',
    _csrf: req.csrfToken()
  });
};

/**
 * POST /recover
 * Handles post requests for user recover, returns the results of the information received
 * @param req express request object
 * @param res express response object
 */
export const postRecover = async (req: Request, res: Response) => {
  const email = req.body.email || '';
  const error = validate(email);
  if (error) {
    req.flash('error', error);
    req.flash('email', email);
    return res.redirect(302, req.originalUrl);
  }

  const result = await recoverPassword(email);
  if (result['success']) {
    req.flash('success', 'Recovery email sent. Please follow the instructions in the email.');
  } else {
    req.flash('error', 'Failed to initiate password recovery.');
  }
  return res.redirect(302, '/recover');
};

/**
 * Validates the email information input on a post request
 * @param email string
 */
const validate = (email: string) => {
  if (!validator.isLength(email, 1, 255)) {
    return 'Please enter a valid email address';
  } else if (!validator.isEmail(email)) {
    return 'Invalid email';
  } else {
    return '';
  }
};
