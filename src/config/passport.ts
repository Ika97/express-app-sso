import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { login } from '../utils/iam';
import { logger } from '../utils/logger';

export const init = () => {
  logger.info('Passport Configured');
};

passport.serializeUser<any, any>((id, done) => {
  done(undefined, id);
});

passport.deserializeUser((id, done) => {
  done(undefined, id);
});

passport.use(new Strategy({ passReqToCallback: true },
  async (req, user, pass, done) => {
    try {
      const res = await login(user, pass);
      const snaid = res['snaid'];
      if (snaid) {
        return done(null, snaid);
      }
      return done(null, false, { message: 'Invalid username/password combination' });
    } catch (err) {
      return done(err);
    }
  }
));
