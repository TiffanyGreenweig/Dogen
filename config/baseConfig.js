const compilerOptions = require('../tsconfig.json').compilerOptions;
/**
 * Support custom root directory alias for imports
 * https://medium.com/@justintulk/solve-module-import-aliasing-for-webpack-jest-and-vscode-74007ce4adc9
 * @param {jsconfig } paths
 */
const mapPathsToAlias = paths => {
  let alias = {};
  Object.keys(paths).forEach(key => {
    if (typeof key != 'string') {
      throw new Error('PARSE ALIAS ERROR: invalid paths key in [../tsconfig.json]');
    }
    if (!Array.isArray(paths[key])) {
      throw new Error('PARSE ALIAS ERROR: invalid paths value in [../tsconfig.json]');
    }
    alias[key.replace('/*', '')] = __dirname + `/../${paths[key][0].replace('/*', '')}`;
  });
  return alias;
};

module.exports = {
  alias: mapPathsToAlias(compilerOptions.paths),
};
