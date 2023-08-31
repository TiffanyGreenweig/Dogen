'use strict';

const fs = require('fs');
const path = require('path');
const resolve = require('resolve');

const paths = require('./paths');

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return '';
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  }

  // Allow the user set the `baseUrl` to `appSrc`.
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  }

  // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with
  // an alias.
  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null;
  }

  // Otherwise, throw an error.
  throw new Error(
    "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
      ' Create React App does not support other values at this time.',
  );
}

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getWebpackAliases(options = {}) {
  const optionsAlias = options.paths
    ? Object.entries(options.paths).reduce((alias, [key, value]) => {
        if (typeof key != 'string') {
          throw new Error('PARSE ALIAS ERROR: invalid paths key in [../tsconfig.json]');
        }
        if (!Array.isArray(value)) {
          throw new Error('PARSE ALIAS ERROR: invalid paths value in [../tsconfig.json]');
        }
        return { ...alias, [key.replace('/*', '')]: __dirname + `/../${value[0].replace('/*', '')}` };
      }, {})
    : {};

  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
      ...optionsAlias,
    };
  }
}

function getModules() {
  const ts = require(resolve.sync('typescript', {
    basedir: paths.appNodeModules,
  }));

  const config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config || {};

  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options);

  return {
    additionalModulePaths: additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
  };
}

module.exports = getModules();
