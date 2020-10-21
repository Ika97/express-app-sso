# Stansberry-Research-SSO

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Stansberry-Holdings/Stansberry-Research-SSO.git
cd Stansberry-Research-SSO
```

### Install the modules

```bash
nvm use 8.11.3
npm install --global gulp-cli@latest
npm install
```

### Setup Env variables

1. Copy the example file as your own environment file. DO NOT COMMIT THIS TO THE REPOSITORY!

    `cp .env.example .env`

    The contents of `.env` will include the following.

    ```sh
    PORT=3000
    TESTING_PORT=3001

    NODE_ENV="development"
    DOMAIN_NAME="localhost"
    DEFAULT_HOSTNAME="stansberryresearch.com"

    REDIS_URL="redis://redis:6379"
    REDIS_PASSWORD=""
    REDIS_KEY_LOCATION=""

    IAM_TOKEN="!AM_T0K3N"
    IAM_ENDPOINT="https://iam.cloudsna.com"

    COOKIE_EXPIRES_IN="1d"
    COOKIE_SECRET="CO0K!E_S3CR3T"

    JWT_ALGORITHM="RS512"
    JWT_EXPIRES_IN="1d"
    JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n<PUBLIC_CHARACTERS />\n-----END PUBLIC KEY-----"
    JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n<SECRET_CHARACTERS />\n-----END RSA PRIVATE KEY-----"
    ```

    1. Please note that the private and public must be on a single line with '/n' used as line separation
1. Create a public and private RSA keys. A tutorial for creating keys is [here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).
1. Copy the contents of your public and private RSA keys into the proper variables.
1. Obtain a valid IAM Token, this requires contacting Web Team developers

### Start the dev server

There are two ways to build & start the dev server.

1. Docker
    1. Create/start: `docker-compose up --build`
    1. Visit [http://localhost:3000](http://localhost:3000)

    More details:
    1. Connect to mongo `mongo localhost:5003`
    1. Visit Redis Commander [http://localhost:3002](http://localhost:3002)

    Other commands:
    1. Stop: `docker-compose stop`
    1. Delete: `docker-compose down`
    1. Start: `docker-compose start` (only after stopping)
    1. Rebuild: `docker-compose up --build` (used when updating files outside of 'src')

1. Gulp
    1. Build: `gulp build`
    1. Start: `npm serve`
    1. Visit [http://localhost:3000](http://localhost:3000)
    1. Stop: `Ctrl + C`

1. NPM
    1. Build: `npm run build`
    1. Start: `npm start`
    1. Watch: `npm run watch`
    1. Debug: `npm run debug`
    1. Visit [http://localhost:3000](http://localhost:3000)
    1. Stop: `Ctrl + C`
