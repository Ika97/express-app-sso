import { Request, Response } from 'express';

/**
 * GET /
 * Renders the home page or if the environment is in production redirects the user to the login `/login` page
 * @param req express request object
 * @param res express response object
 */
export const getHome = (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.redirect(302, '/login'.concat(req.originalUrl.slice(1)));
  }

  return res.render('home', {
    title: 'Home - Stansberry Research',
    user: req.user,
    lastToken: req.session.lastToken,
    lastRedirectUrl: req.session.lastRedirectUrl
  });
};
