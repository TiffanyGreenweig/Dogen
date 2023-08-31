const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const appVersion = require(path.resolve(appDirectory, 'package.json')).version;

const NODE_ENV = process.env.NODE_ENV || 'development';
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

const GROOT_ENV = process.env.GROOT_ENV || 'qa'; // the project current env

// let SENTRY_AUTH_TOKEN = ''; // the sentry auth token for release the source map
let webAppVersion = 'unknown'; // the current version of webapp
const now = Date.now();
const buildId = process.env.CI_JOB_ID || now;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}
// Map the env SENTRY_AUTH_TOKEN for one name
// switch (GROOT_ENV) {
//   case 'case':
//     SENTRY_AUTH_TOKEN = process.env.SENTRY_QA_AUTH_TOKEN; // from CI
//     break;
//   case 'qa':
//     SENTRY_AUTH_TOKEN = process.env.SENTRY_QA_AUTH_TOKEN; // from CI
//     break;
//   case 'sim':
//     SENTRY_AUTH_TOKEN = process.env.SENTRY_QA_AUTH_TOKEN; // from CI
//     break;
//   default:
//     SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
//     break;
// }

// When development build
if (!NODE_ENV || NODE_ENV === 'development') {
  webAppVersion = `${appVersion}-dev${buildId}`;
}
// When Deploy build
else {
  webAppVersion = `${appVersion}-build${buildId}`;
}
const dotenv = path.resolve(appDirectory, '.env');
// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
let dotenvFiles = [
  `${dotenv}.${NODE_ENV}.local`,
  `${dotenv}/${process.env.CI_ENVIRONMENT_NAME || 'dev'}.env`,
  `${dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotenv}.local`,
  dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand').expand(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebook/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
        // Peppa env.
        GROOT_ENV: process.env.GROOT_ENV || 'qa',
        // Sentry env config
        // SENTRY_AUTH_TOKEN: SENTRY_AUTH_TOKEN,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ORG: process.env.SENTRY_ORG,
        SENTRY_PROJECT: process.env.SENTRY_PROJECT,
        SENTRY_URL: process.env.SENTRY_URL,
        PKM_CDN_PATH: process.env.PKM_CDN_PATH,
        MESSAGE_SERVER_URL: process.env.MESSAGE_SERVER_URL,
        SENTRY_URL_PREFIX: `~/v1/${process.env.CI_ENVIRONMENT_NAME}/${process.env.PKM_PKG_ID}/web/`,
        // Web app semver.
        WEB_APP_VERSION: process.env.PKM_VERSION || webAppVersion,
        WEB_APP_LAST_MODIFIED: now,
        WEB_APP_BUILD_ID: buildId,
        TCAPTCHA_APP_ID: process.env.TCAPTCHA_APP_ID,
        REACT_APP_FACEBOOK_APPID: process.env.REACT_APP_FACEBOOK_APPID,
      },
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
