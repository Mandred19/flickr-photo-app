const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const AutoprefixerPlugin = require('autoprefixer');
const EslintFormatterPretty = require('eslint-formatter-pretty');
const nodeSassGlobImporter = require('node-sass-glob-importer');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const {
    mode: MODE,
    proxy: PROXY,
    debug: DEBUG,
    analyze: ANALYZE,
    'dev-server': DEV_SERVER,
  } = argv;

  const POSTFIX = argv.postfix ? `-${argv.postfix}` : '';

  const PRODUCTION = MODE === 'production';
  const DEVELOPMENT = MODE === 'development';

  const config = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
      filename: `bundle${POSTFIX}.js`,
      path: DEBUG ? path.resolve(__dirname, './debug') : path.resolve(__dirname, './dist'),
      publicPath: DEV_SERVER ? '/' : '/flickr-photo-app/',
      chunkFilename: `[name].bundle${POSTFIX}.js`,
      hotUpdateChunkFilename: '~hot-update.[id].[hash].js',
      hotUpdateMainFilename: '~hot-update.[hash].json'
    },

    devtool: DEVELOPMENT ? 'cheap-module-eval-source-map' : false,

    devServer: DEV_SERVER ? {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: PROXY,
          secure: false
        },
        '/public': {
          target: PROXY,
          secure: false
        },
      },
      historyApiFallback: true,
      hot: true,
      stats: {
        children: false,
        entrypoints: false,
        modules: false,
        cachedAssets: false
      }
    } : undefined,

    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            extractComments: 'all',
            compress: {
              drop_console: true,
            },
          },
        }),
        new OptimizeCSSAssetsWebpackPlugin({
          cssProcessorOptions: {
            discardUnused: { fontFace: false },
            discardComments: { removeAll: true },
          },
        }),
      ],
      runtimeChunk: DEVELOPMENT && !DEBUG,
      splitChunks: {
        chunks: 'all',
        maxAsyncRequests: 5,
        maxInitialRequests: 5,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
          },
          // default: {
          //   priority: -20,
          //   reuseExistingChunk: true
          // }
        }
      },
    },

    performance: {
      hints: false
    },
    stats: {
      children: false,
      entrypoints: false,
      modules: false,
    },

    module: {
      rules: [
        {
          test: /\.(js|vue)$/i,
          use: [
            {
              loader: 'eslint-loader',
              options: {
                formatter: EslintFormatterPretty,
                configFile: path.resolve(__dirname, './.eslintrc.js'),
                ignorePath: path.resolve(__dirname, './.eslintignore'),
                fix: false,
                cache: false,
              }
            }
          ],
          include: /src/,
          exclude: /node_modules/,
          enforce: 'pre',
        },
        {
          test: /.vue$/,
          use: {
            loader: 'vue-loader',
          },
          include: /src/,
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve(__dirname, './node_modules/.cache/cache-loader'),
              }
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/syntax-dynamic-import'],
                cacheDirectory: true,
              },
            },
          ],
          include: [
            path.resolve(__dirname, './src'),
          ],
        },
        {
          test: /\.pug$/,
          oneOf: [
            {
              resourceQuery: /^\?vue/,
              use: ['pug-plain-loader'],
            },
            {
              use: ['raw-loader', 'pug-plain-loader'],
            },
          ],
        },
        {
          test: /\.(css|scss)$/i,
          use: PRODUCTION ? [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [AutoprefixerPlugin],
              }
            },
            {
              loader: 'resolve-url-loader',
              options: {
                removeCR: true,
              },
            },
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve(__dirname, './node_modules/.cache/cache-loader'),
              }
            },
            {
              loader: 'sass-loader',
              options: {
                prependData: `@import "~styles/_variables.scss";@import "~styles/_mixins.scss";@import "~styles/_classes.scss";`,
                sassOptions: {
                  importer: nodeSassGlobImporter(),
                  includePaths: [
                    path.resolve(__dirname, './node_modules/')
                  ],
                },
              },
            },
          ] : [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                removeCR: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                prependData: `@import "~styles/_variables.scss";@import "~styles/_mixins.scss";@import "~styles/_classes.scss";`,
                sassOptions: {
                  importer: nodeSassGlobImporter(),
                  includePaths: [
                    path.resolve(__dirname, './node_modules/'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|webp)$/i,
          use: PRODUCTION ? [
            {
              loader: 'file-loader',
              options: {
                name: '[hash].[ext]',
                outputPath: 'images/',
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 75,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.75, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
              }
            },
          ] : [
            {
              loader: 'file-loader',
              options: {
                name: '[hash].[ext]',
                outputPath: 'images/',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[hash].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.vue', '.ts', '.js', '.json'],
      alias: {
        components: path.resolve(__dirname, './src/components'),
        helpers: path.resolve(__dirname, './src/helpers'),
        assets: path.resolve(__dirname, './src/assets'),
        views: path.resolve(__dirname, './src/views'),
        store: path.resolve(__dirname, './src/store'),
        router: path.resolve(__dirname, './src/router'),
        styles: path.resolve(__dirname, './src/styles'),
        src: path.resolve(__dirname, './src'),
        // localization: path.resolve(__dirname, './src/localization.js'),
        // locale: path.resolve(__dirname, './src/locale'),
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, './public/index.html'),
        favicon: path.resolve(__dirname, './public/favicon.ico'),
        title: 'Flickr photo app',
        meta: {
          charset: { charset: 'utf-8' },
          httpEquiv: 'X-UA-Compatible',
          content: 'IE=edge',
          themeColor: '#E3F1F4',
          viewport: 'width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
        minify: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        DEVELOPMENT,
        PRODUCTION,
        PROXY: JSON.stringify(PROXY),
      }),
    ]
  };

  const developmentPlugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];

  const productionPlugins = [
    new MiniCssExtractPlugin({
      filename: `styles${POSTFIX}.css`,
      chunkFilename: `[name].styles${POSTFIX}.css`
    }),
  ];

  const analyzePlugins = [
    new BundleAnalyzerPlugin({
      analyzerPort: 3001,
    })
  ];

  if (DEVELOPMENT) {
    config.plugins.push(...developmentPlugins);
  }
  if (PRODUCTION) {
    config.plugins.push(...productionPlugins);
  }
  if (ANALYZE) {
    config.plugins.push(...analyzePlugins);
  }

  return config;
};
