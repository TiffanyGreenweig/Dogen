'use strict';

process.env.NODE_ENV = 'production';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const postcssWriteSvg = require('postcss-write-svg');
// const postcssCssnext = require('postcss-cssnext');
const cssnano = require('cssnano');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const theme = require('../package.json').theme;
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const postcssPxToRem = require('postcss-plugin-px2rem');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

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

const appDirectory = fs.realpathSync(process.cwd());
const appVersion = require(path.resolve(appDirectory, 'package.json')).version;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: process.env.PKM_CDN_PATH + '/',
      },
    },
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
          plugins: [
            require('postcss-flexbugs-fixes'),
            // require('postcss-safe-area'),
            require('postcss-momentum-scrolling')(['hidden', 'scroll', 'auto', 'inherit']),
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
  const localEnvs = getClientEnvironment();

  process.env.WEB_APP_VERSION = process.env.PKM_VERSION || localEnvs.raw.WEB_APP_VERSION;
  process.env.GROOT_ENV = localEnvs.raw.GROOT_ENV;
  console.log('xxxxx->log', process.env.GROOT_ENV, JSON.stringify(localEnvs.raw, null, ' '));

  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile = process.argv.includes('--profile');

  return {
    target: ['browserslist'],
    // Webpack noise constrained to errors and warnings
    stats: 'errors-warnings',
    mode: 'production',
    // Stop compilation early in production
    bail: true,
    devtool: 'source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: paths.appIndex,
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: false,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'static/js/[name].[contenthash:8].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    optimization: {
      minimize: true,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'async', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
        minSize: 30000, // 代码分割的最小值
        minChunks: 2, // 模块被引用>=1次，便分割
        maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
        maxInitialRequests: 5, // 一个入口并发加载的chunk数量<=3
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendor: {
            // test: /node_modules\/(?!antd\/).*/,
            // test: /node_modules\/(antd\/).*/,
            test: /[\\/]node_modules[\\/](?!react.*\/).*/,
            name: 'vendor',
            chunks: 'initial',
            enforce: true,
            reuseExistingChunk: true,
          },
        },
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
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: /\.(png|jpe?g|gif|ttf|eot|svg|woff|woff2|mp3)$/i,
              use: [
                {
                  loader: require.resolve('url-loader'),
                  options: {
                    limit: 10000,
                    esModule: false,
                    name: 'static/media/[name].[hash:8].[ext]',
                  },
                },
              ],
              type: 'javascript/auto',
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
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
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
                      runtime: 'automatic',
                    },
                  ],
                  [require('@babel/preset-typescript').default],
                ],
                plugins: [
                  ['import', { libraryName: 'antd', style: true }],
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
                compact: true,
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
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
              }),
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
          ],
        },
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: false,
        params: {
          PKM_CDN_PATH: process.env.PKM_CDN_PATH,
          ...localEnvs.raw,
        },
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(localEnvs.stringified),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        ignoreOrder: true,
      }),
      // TypeScript type checking
      new ForkTsCheckerWebpackPlugin({
        async: false,
        typescript: {
          typescriptPath: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          configOverwrite: {
            compilerOptions: {
              sourceMap: shouldUseSourceMap,
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
        failOnError: false,
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
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve('public/favicon.ico'),
            to: path.resolve(
              process.env.PEPPA_OUTPUT ? `${process.env.PEPPA_OUTPUT}/unpacked` : path.resolve('./dist'),
            ),
          },
          {
            from: path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps'),
            to: 'cmaps/',
          },
        ],
      }),
    ].filter(Boolean),
  };
};
