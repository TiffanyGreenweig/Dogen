const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const postcssWriteSvg = require('postcss-write-svg');
const cssnano = require('cssnano');

const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const theme = require('../package.json').theme;
const postcssPxToRem = require('postcss-plugin-px2rem');

const createEnvironmentHash = require('./webpack/persistentCache/createEnvironmentHash');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

const cssRegex = /\.css$/;
const lessRegex = /\.less$/;
const cssModuleRegex = /\.module\.css$/;
const lessModuleRegex = /\.module\.[less|css]$/;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          config: false,
          plugins: [
            'postcss-flexbugs-fixes',
            ['postcss-momentum-scrolling', ['hidden', 'scroll', 'auto', 'inherit']],
            postcssWriteSvg({
              utf8: false,
            }),
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              },
            ],
            postcssPxToRem({
              rootValue: { px: 46.875 },
              unitPrecision: 3,
              propList: ['*'],
              selectorBlackList: [],
              replace: true,
              mediaQuery: false,
              minPixelValue: 0,
              exclude: /^((?!node_modules\/antd-mobile\/).)*$/gim,
            }),
            // 750*1334、1334*750 设计稿使用px单位；2048*1536 使用rpx单位
            postcssPxToRem({
              rootValue: { px: 192, rpx: 46.875 },
              unitPrecision: 3,
              propList: ['*'],
              selectorBlackList: ['preserve'],
              replace: true,
              mediaQuery: false,
              minPixelValue: 0,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            'postcss-normalize',
            cssnano({
              'cssnano-preset-advanced': {
                zindex: false,
                autoprefixer: false,
                reduceIdents: false,
              },
            }),
          ],
        },
        sourceMap: true,
      },
    },
  ];
  if (preProcessor) {
    const options = {};
    if (preProcessor === 'less-loader') {
      options['modifyVars'] = { ...theme, 'img-cdn': `"${process.env.REACT_APP_ASSETS_PREFIX}"` };
      options['javascriptEnabled'] = true;
    }
    loaders.push({
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve(preProcessor),
      options: {
        lessOptions: options,
      },
    });
  }
  return loaders;
};

module.exports = () => {
  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  process.env.WEB_APP_VERSION = env.raw.WEB_APP_VERSION;
  process.env.GROOT_ENV = env.raw.GROOT_ENV;

  return {
    target: ['web', 'es5'],
    // Webpack noise constrained to errors and warnings
    stats: 'errors-warnings',
    mode: 'development',
    devtool: 'source-map',
    entry: paths.appIndex,
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig],
      },
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        ...(modules.webpackAliases || {}),
      },
    },
    module: {
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              test: [/\.ttf$/, /\.eot$/, /\.woff2?$/],
              type: 'asset/resource',
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    // Latest stable ECMAScript features
                    require('@babel/preset-env').default,
                    {
                      // Allow importing core-js in entrypoint and use browserlist to select polyfills
                      useBuiltIns: 'entry',
                      // Set the corejs version we are using to avoid warnings in console
                      corejs: 3,
                      // Exclude transforms that make all code slower
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                  [
                    require('@babel/preset-react').default,
                    {
                      // Adds component stack to warning messages
                      // Adds __self attribute to JSX which React will use for some warnings
                      development: true,
                      // Will use the native built-in instead of trying to polyfill
                      // behavior for any plugins that require one.
                      useBuiltIns: true,
                      runtime: 'automatic',
                    },
                  ],
                  [require('@babel/preset-typescript').default],
                ],
                plugins: [
                  [
                    'import',
                    {
                      libraryName: 'antd',
                      style: true,
                    },
                    'antd',
                  ],
                  require.resolve('react-refresh/babel'),
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                      },
                    },
                  ],
                  // Turn on legacy decorators for TypeScript files
                  [require('@babel/plugin-proposal-decorators').default, false],
                  // class { handleClick = () => { } }
                  // Enable loose mode to use assignment instead of defineProperty
                  // See discussion in https://github.com/facebook/create-react-app/issues/4263
                  // Note:
                  // 'loose' mode configuration must be the same for
                  // * @babel/plugin-proposal-class-properties
                  // * @babel/plugin-proposal-private-methods
                  // * @babel/plugin-proposal-private-property-in-object
                  // (when they are enabled)
                  [
                    require('@babel/plugin-proposal-class-properties').default,
                    {
                      loose: true,
                    },
                  ],
                  [
                    require('@babel/plugin-proposal-private-methods').default,
                    {
                      loose: true,
                    },
                  ],
                  [
                    require('@babel/plugin-proposal-private-property-in-object').default,
                    {
                      loose: true,
                    },
                  ],
                  // Polyfills the runtime needed for async/await, generators, and friends
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
                  [
                    require('@babel/plugin-transform-runtime').default,
                    {
                      corejs: false,
                      helpers: true,
                      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                      // explicitly resolving to match the provided helper functions.
                      // https://github.com/babel/babel/issues/10261
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                      // We should turn this on once the lowest version of Node LTS
                      // supports ES Modules.
                      useESModules: true,
                      // Undocumented option that lets us encapsulate our runtime, ensuring
                      // the correct version is used
                      // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                      absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
                    },
                  ],
                ],
                overrides: [
                  {
                    test: /\.tsx?$/,
                    plugins: [[require('@babel/plugin-proposal-decorators').default, { legacy: true }]],
                  },
                ],
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: false,
              },
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                // presets: [
                //   [
                //     require.resolve('babel-preset-react-app/dependencies'),
                //     { helpers: true },
                //   ],
                // ],
                // Babel assumes ES Modules, which isn't safe until CommonJS
                // dies. This changes the behavior to assume CommonJS unless
                // an `import` or `export` is present in the file.
                // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
                sourceType: 'unambiguous',
                presets: [
                  [
                    // Latest stable ECMAScript features
                    require('@babel/preset-env').default,
                    {
                      // Allow importing core-js in entrypoint and use browserlist to select polyfills
                      useBuiltIns: 'entry',
                      // Set the corejs version we are using to avoid warnings in console
                      // This will need to change once we upgrade to corejs@3
                      corejs: 3,
                      // Exclude transforms that make all code slower
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                ],
                plugins: [
                  // Polyfills the runtime needed for async/await, generators, and friends
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
                  [
                    require('@babel/plugin-transform-runtime').default,
                    {
                      corejs: false,
                      helpers: true,
                      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                      // explicitly resolving to match the provided helper functions.
                      // https://github.com/babel/babel/issues/10261
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                      // We should turn this on once the lowest version of Node LTS
                      // supports ES Modules.
                      useESModules: true,
                      // Undocumented option that lets us encapsulate our runtime, ensuring
                      // the correct version is used
                      // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                      absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
                    },
                  ],
                ],
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            {
              test: lessRegex,
              exclude: lessModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                },
                'less-loader',
              ),
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
              }),
            },
          ],
        },
      ],
    },
    // watchOptions: {
    // },
    devServer: {
      allowedHosts: 'all',
      // Enable gzip compression of generated files.
      compress: true,
      static: {
        // By default WebpackDevServer serves physical files from current directory
        // in addition to all the virtual build products that it serves from memory.
        // This is confusing because those files won’t automatically be available in
        // production build folder unless we copy them. However, copying the whole
        // project directory is dangerous because we may expose sensitive files.
        // Instead, we establish a convention that only files in `public` directory
        // get served. Our build script will copy `public` into the `build` folder.
        // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
        // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
        // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
        // Note that we only recommend to use `public` folder as an escape hatch
        // for files like `favicon.ico`, `manifest.json`, and libraries that are
        // for some reason broken when imported through webpack. If you just want to
        // use an image, put it in `src` and `import` it from JavaScript instead.
        directory: paths.appPublic,
        publicPath: [paths.publicUrlOrPath],
        // By default files from `contentBase` will not trigger a page reload.
        watch: {
          // Reportedly, this avoids CPU overload on some systems.
          // https://github.com/facebook/create-react-app/issues/293
          // src/node_modules is not ignored to support absolute imports
          // https://github.com/facebook/create-react-app/issues/1065
          ignored: ['node_modules'],
        },
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebook/create-react-app/issues/387.
        disableDotRule: true,
        index: paths.publicUrlOrPath,
      },
      hot: true,
      port: 3003,
      proxy: {
        '/api': {
          target: `${process.env.REACT_APP_BASE_API_URL}`,
          secure: false,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        params: {
          PKM_CDN_PATH: process.env.PKM_CDN_PATH,
          ...env.raw,
        },
      }),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),
      // TypeScript type checking
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          typescriptPath: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          configOverwrite: {
            compilerOptions: {
              sourceMap: true,
              skipLibCheck: true,
              inlineSourceMap: false,
              declarationMap: false,
              noEmit: true,
              incremental: true,
              tsBuildInfoFile: paths.appTsBuildInfoFile,
            },
          },
          context: paths.appPath,
          diagnosticOptions: {
            syntactic: true,
          },
          mode: 'write-references',
          // profile: true,
        },
        issue: {
          // This one is specifically to match during CI tests,
          // as micromatch doesn't match
          // '../cra-template-typescript/template/src/App.tsx'
          // otherwise.
          include: [{ file: '../**/src/**/*.{ts,tsx}' }, { file: '**/src/**/*.{ts,tsx}' }],
        },
      }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        eslintPath: require.resolve('eslint'),
        failOnError: !emitErrorsAsWarnings,
        context: paths.appSrc,
        cache: true,
        cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
        // ESLint class options
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          // extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      }),
      // 统计重新引用
      process.env.REACT_APP_ANALYZER_CHECKER === 'true' && new DuplicatePackageCheckerPlugin(),
      // process.env.REACT_APP_ANALYZER_CHECKER === 'true' && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  };
};
