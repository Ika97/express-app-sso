import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as connectRedis from 'connect-redis';
import * as cors from 'cors';
import * as csrf from 'csurf';
import * as express from 'express';
import * as flash from 'express-flash';
import * as session from 'express-session';
import * as fs from 'fs';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as path from 'path';
import { parse } from 'url';
import * as environment from './config/environment';
import * as passportConfig from './config/passport';
import { getHome } from './controllers/home';
import { getLogin, postLogin } from './controllers/login';
import { getLogout } from './controllers/logout';
import { getRecover, postRecover } from './controllers/recover';
import { getReset, postReset, recoverRedirect, validateRequestToken } from './controllers/reset';
import { checkSession, displayError, errorHandler } from './middleware/errors';
import { removeSlashes } from './middleware/redirects';
import { logger } from './utils/logger';
import ms = require('ms');

// initialize configuration
environment.init();
passportConfig.init();

// create the necessary constants
const RedisStore = connectRedis(session);
const isProduction = process.env.NODE_ENV === 'production';
const domain = process.env.DOMAIN_NAME || 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const protocol = isProduction ? 'https://' : 'http://';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisPassword = process.env.REDIS_PASSWORD;
const redisKeyLocation = process.env.REDIS_KEY_LOCATION;
let redisOptions: connectRedis.RedisStoreOptions = { url: redisUrl };

if (redisPassword && redisKeyLocation) {
  redisOptions.pass = redisPassword;
  redisOptions['tls'] = {
    rejectUnauthorized: false,
    servername: parse(redisUrl).hostname,
    ca: [ fs.readFileSync(path.resolve(__dirname, redisKeyLocation)) ]
  };
}

// create the express application
const app = express();

// set the view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// configure express middleware (ORDER MATTERS!!!)
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  cookie: {
    expires: true,
    path: '/',
    domain: domain,
    httpOnly: true,
    maxAge: ms(process.env.COOKIE_EXPIRES_IN || '1d'),
    sameSite: true,
    secure: 'auto',
    signed: true
  },
  name: 'SRSSO_SID',
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET || '',
  store: new RedisStore(redisOptions)
}));
app.use(checkSession());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: false }));
app.use(flash());
app.use(helmet({ frameguard: { action: 'deny' }, noCache: true }));
app.use(cors({ origin: domain, optionsSuccessStatus: 200 }));
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(removeSlashes());

// set static assets route
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// set express routes
// home
app.route('/').get(getHome);

// login
app.route('/login').get(getLogin).post(postLogin);

// logout
app.route('/logout').get(getLogout);

// recover password
app.route('/recover').get(getRecover).post(postRecover);

// reset password
app.route('/reset').all(recoverRedirect);
app.route('/reset/:token').get(validateRequestToken, getReset).post(validateRequestToken, postReset);

// display the error page
// must go after all other `app.route()` calls
app.route('*').all(displayError);

app.use(errorHandler());
app.listen(port, () => {
  logger.info('App is running at '.concat(protocol, domain, ':', String(port), ' in ', app.get('env'), ' mode'));
  logger.info('Press CTRL-C to stop');
});

export { app };
