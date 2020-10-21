import { Request, Response, NextFunction } from 'express';
import * as validator from 'validator';
import { resetPassword, validateToken } from '../utils/iam';

const invalidToken = 'Invalid reset password token.\nPlease start the recovery process, again.';
const invalidEmail = 'Invalid email.\nPlease start the recovery process, again.';

/**
 * GET /reset/:token
 * Get reset password, requires a token
 * @param req express request object
 * @param res express response object
 */
export const getReset = async (req: Request, res: Response) => {
  const reqToken = req.params['token'] || '';
  const localsToken = res.locals['token'] || '';
  const localsEmail = res.locals['email'] || '';

  if (!validator.equals(reqToken, localsToken)) {
    req.flash('error', invalidToken);
    return res.redirect(302, '/recover');
  }

  if (validator.isEmpty(localsEmail) || !validator.isEmail(localsEmail)) {
    req.flash('error', invalidEmail);
    return res.redirect(302, '/recover');
  }

  return res.render('reset', {
    title: 'Reset Password - Stansberry Research',
    _csrf: req.csrfToken(),
    action: req.originalUrl
  });
};

/**
 * POST /reset/:token
 * Post reset password, requires a token
 * @param req express request object
 * @param res express response object
 */
export const postReset = async (req: Request, res: Response) => {
  const password = req.body['password'] || '';
  const confirmPassword = req.body['confirmPassword'] || '';
  const reqToken = req.params['token'] || '';
  const localsToken = res.locals['token'] || '';
  const localsEmail = res.locals['email'] || '';

  if (!validator.equals(reqToken, localsToken)) {
    req.flash('error', invalidToken);
    return res.redirect(302, '/recover');
  }

  if (validator.isEmpty(localsEmail) || !validator.isEmail(localsEmail)) {
    req.flash('error', invalidEmail);
    return res.redirect(302, '/recover');
  }

  const error = validate(password, confirmPassword);
  if (error) {
    req.flash('error', error);
    req.flash('password', password);
    req.flash('confirmPassword', confirmPassword);
    return res.redirect(302, req.originalUrl);
  }

  const result = await resetPassword(password, localsToken, localsEmail);
  if (result['success']) {
    req.flash('success', 'Your password was changed');
  } else {
    req.flash('error', 'Error: Your password was not changed');
  }
  return res.redirect(302, '/logout');
};

/**
 * Redirects all requests without a token parameter in the URL to `/recover` with an error message
 * @param req express request object
 * @param res express response object
 */
export const recoverRedirect = async (req: Request, res: Response) => {
  req.flash('error', invalidToken);
  return res.redirect(302, '/recover');
};

/**
 * Validates all token with requests to `/reset/:token`
 * @param req express request object
 * @param res express response object
 * @param next express middleware function
 */
export const validateRequestToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params['token'] || '';
  const result = await validateToken(token);

  if (!result['success']) {
    req.flash('error', invalidToken);
    return res.redirect(302, '/recover');
  }

  res.locals.token = result['token'];
  res.locals.email = result['email'];
  next();
};

/**
 * Validates the password information input on a post request
 * @param password string
 * @param confirmPassword string
 */
const validate = (password: string, confirmPassword: string) => {
  if (!validator.isLength(password, { min: 6, max: undefined })) {
    return 'Please enter a password with 6 or more characters';
  } else if (!validator.isLength(password, { min: 6, max: 100 })) {
    return 'Please enter a password with 100 or less characters';
  } else if (!validator.equals(password, confirmPassword)) {
    return 'Passwords do not match';
  } else {
    return '';
  }
};
