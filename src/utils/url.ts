import { parse } from 'url';
import { Request } from 'express';

const DEFAULT_HOSTNAME = process.env.DEFAULT_HOSTNAME || 'stansberryresearch.com';

/**
 * Generate an entire URL with token included to the requesting application
 * @param req express request object
 */
export const generateRedirectUrl = (req: Request) => {
  if (req.query.redirectUrl) {
    if (!req.query.redirectUrl.startsWith('http://') && !req.query.redirectUrl.startsWith('https://')) {
      req.query.redirectUrl = 'https://'.concat(req.query.redirectUrl);
    }

    const parsedUrl = parse(req.query.redirectUrl);
    let redirectUrl = parsedUrl.hostname;

    if (redirectUrl !== 'stansberryresearch.com' && redirectUrl !== 'members.stansberryresearch.com') {
      redirectUrl = DEFAULT_HOSTNAME;
    }

    if (parsedUrl.pathname && parsedUrl.pathname.length > 1 && parsedUrl.pathname.startsWith('/')) {
      redirectUrl = redirectUrl.concat(parsedUrl.pathname, '?');
    } else {
      redirectUrl = redirectUrl.concat('?');
    }

    if (parsedUrl.query) {
      redirectUrl = redirectUrl.concat(parsedUrl.query, '&');
    }

    return 'http://'.concat(redirectUrl, 'token=');
  }
  return 'https://'.concat(DEFAULT_HOSTNAME, '?token=');
};
