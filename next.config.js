const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const publicRuntimeConfig = require('./config/publicRuntime')
const inDevelopment = process.env.NODE_ENV === "development"

const NextAppConfig = {
  progressBar: {
    profile: false,
  },
  useFileSystemPublicRoutes: true,
  target: 'server',
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': `${__dirname}/src`,
      '@config': `${__dirname}/config`,
    }
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    });
    if (options.isServer) {

    }
    return config;
  },
  webpackDevMiddleware: (config, options) => {
    config.watchOptions.ignored = [
      ...config.watchOptions.ignored,
      /\.git\//,
      /\.next\//,
      /node_modules/,
      /[\\\/]app[\\\/]/,
      /[\\\/]dist[\\\/]/,
      /[\\\/]libs[\\\/]/,
      /[\\\/]logs[\\\/]/,
      /[\\\/]public[\\\/]/,
      /[\\\/]static[\\\/]/,
      /[\\\/]routes[\\\/]/,
      /[\\\/]databases[\\\/]/,
      /[\\\/]docs[\\\/]/,
      /next\.config\.js/
    ]
    return config
  },
  onDemandEntries: {
    maxInactiveAge: 60000000,
    pagesBufferLength: 99999
  },
  compress: !inDevelopment,
  publicRuntimeConfig: publicRuntimeConfig,
};

module.exports = withPlugins([
  [withLess, {
    lessLoaderOptions: {
      javascriptEnabled: true
    }
  }],
  withCss
], NextAppConfig);
