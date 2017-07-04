var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var url = require('url');
var objectAssign = require('object-assign');
var getClientEnvironment = require('./env');
var paths = require('./paths');

var babelConfig = require('./babel');
var isDevelopment = process.env.NODE_ENV !== 'production';

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

babelConfig = objectAssign(babelConfig, {
  cacheDirectory: isDevelopment,
});

if (!isDevelopment) {
  // Production mode
  var homepagePath = paths.homepage;
  var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
  var publicPath = ensureSlash(homepagePathname, true);
  var publicUrl = ensureSlash(homepagePathname, false);
} else {
  // Development mode
  var publicPath = '/';
  var publicUrl = '';
}

// Now we can fill the environment object with some meta data to make them
// available in the source files (see above)
var env = getClientEnvironment(publicUrl);

// Set up environment specific configs

// ****** Development ******
// Main configs
var configDev = {
  'devtool': 'cheap-module-source-map',
  'entry': [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.indexJs
  ],
  'output': {
    path: paths.build,
    pathinfo: true,
    filename: paths.buildBundleJs,
    publicPath: publicPath
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
      minify: false,
      hash: false
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
};
// ...and loaders
var loadersDev = [
  {
    test: /\.css$/,
    loaders: ['style-loader', 'css', 'postcss']
  },
  {
    test: /\.scss$/,
    loaders: ['style-loader', 'css', 'sass', 'postcss']
  }
];

// ****** Production ******
// Main config
var configProd = {
  'bail': true,
  'devtool': 'source-map',
  'entry': [
    // No HotDev in production
    require.resolve('./polyfills'),
    paths.indexJs
  ],
  'output': {
    path: paths.build,
    filename: 'main.js',
    // Chunk file for async code in production
    chunkFilename: 'js/[name].chunk.js',
    publicPath: publicPath
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: false,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin(env),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css'), // .[contenthash:8]
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ],
};
// ...and loaders as well
var loadersProd = [
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css?importLoaders=1!postcss')
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css?importLoaders=1!sass!postcss')
  }
];

// This is a merged configuration for both development and production build
// It determines the current mode using `isDevelopment` which was set above
// and merges the enviroment specific settings we just created!
module.exports = objectAssign({
  resolve: {
    fallback: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web'
    }
  },
  
  module: {
    // preLoaders: [
    //   // First, run the linter.
    //   // It's important to do this before Babel processes the JS.
    //   {
    //     test: /\.(js|jsx)$/,
    //     loader: 'eslint',
    //     include: paths.src,
    //   }
    // ],
    loaders: [
      // Copy all files that we are not handling later (see exclude) to the
      // assets folder
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'assets/[name].[ext]'
        }
      },
      // Process JS/JSX with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        loader: 'babel-loader',
        query: babelConfig
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'assets/svg/[name].[ext]'
        }
      }
      // NOTE: CSS and SASS loaders are in the environment specific config, which
      // is merged below!
    ].concat(isDevelopment ? loadersDev : loadersProd)
  },
  
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}, (isDevelopment ? configDev : configProd));