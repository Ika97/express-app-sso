import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import * as validator from 'validator';
import { generateRedirectUrl } from '../utils/url';
import { generateToken } from '../utils/jwt';

/**
 * GET /login
 * Renders the login page to begin the user login process
 * @param req express request object
 * @param res express response object
 */
export const getLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect(302, redirectUser(req.user, req));
  }

  return res.render('login', {
    title: 'Login - Stansberry Research',
    _csrf: req.csrfToken(),
    action: req.originalUrl
  });
};

/**
 * POST /login
 * Handles post requests for user login and authentication, returns the results of the information received
 * @param req express request object
 * @param res express response object
 * @param next express middleware function
 */
export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect(302, redirectUser(req.user, req));
  }
  const username = req.body.username || '';
  const password = req.body.password || '';
  const error = validate(username, password);

  if (error) {
    req.flash('error', error);
    req.flash('username', username);
    req.flash('password', password);
    return res.redirect(302, req.originalUrl);
  }

  passport.authenticate(
    'local',
    (err: Error, snaid: string, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!snaid) {
        req.flash('error', info.message);
        req.flash('username', username);
        req.flash('password', password);
        return res.redirect(302, req.originalUrl);
      }
      req.logIn(snaid, (logInErr) => {
        if (logInErr) { return next(logInErr); }
        return res.redirect(302, redirectUser(snaid, req));
      });
    }
  )(req, res, next);
};

/**
 * Validates the username and password information input on a post request
 * @param username string
 * @param password string
 */
const validate = (username: string, password: string) => {
  if (!validator.isLength(username, 1, 101)) {
    return 'Please enter a username';
  } else if (!validator.isLength(password, 1, 101)) {
    return 'Please enter a password';
  } else {
    return '';
  }
};

/**
 * Creates a user redirect URL for authenticated users to be sent
 * @param snaid string of user's ID
 * @param req express request object
 */
const redirectUser = (snaid: any, req: Request) => {
  const redirectUrl = generateRedirectUrl(req);
  // cleaning up the url to remove "[&?]token=" from the end of the redirection URL
  req.session.lastRedirectUrl = redirectUrl.slice(0, -7);

  const token = generateToken({ snaid: snaid}, req);
  req.session.lastToken = token;

  return redirectUrl + token;
};
