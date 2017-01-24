process.env.NODE_ENV = 'development';
require('dotenv').config({silent: true});

var chalk = require('chalk');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var historyApiFallback = require('connect-history-api-fallback');
var httpProxyMiddleware = require('http-proxy-middleware');
var detect = require('detect-port');
var clearConsole = require('react-dev-utils/clearConsole');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var getProcessForPort = require('react-dev-utils/getProcessForPort');
var openBrowser = require('react-dev-utils/openBrowser');
var prompt = require('react-dev-utils/prompt');
var config = require('../../config/webview/webpack');
var paths = require('../../config/webview/paths');

var isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.indexHtml, paths.indexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
var DEFAULT_PORT = process.env.PORT || 3000;
var compiler;
var handleCompile;

function setupCompiler(host, port, protocol) {
  compiler = webpack(config, handleCompile);
  compiler.plugin('invalid', function() {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  var isFirstCompile = true;

  compiler.plugin('done', function(stats) {
    if (isInteractive) {
      clearConsole();
    }

    var messages = formatWebpackMessages(stats.toJson({}, true));
    var isSuccessful = !messages.errors.length && !messages.warnings.length;
    var showInstructions = isSuccessful && (isInteractive || isFirstCompile);

    if (isSuccessful) {
      console.log(chalk.green('✓ Compiled successfully!'));
    }

    if (showInstructions) {
      console.log();
      console.log('The app is running at:');
      console.log(chalk.cyan(protocol + '://' + host + ':' + port + '/'));
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log('To create a production build, use ' + chalk.cyan('yarn build') + '.');
      console.log();
      isFirstCompile = false;
    }

    // Errors
    if (messages.errors.length) {
      console.log(chalk.red.bold('Failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(chalk.red(message));
        console.log();
      });
      return;
    }

    // Warnings
    if (messages.warnings.length) {
      console.log(chalk.yellow.bold('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(chalk.yellow(message));
        console.log();
      });
      console.log('You may use special comments to disable some warnings.');
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
  });
}

function onProxyError(proxy) {
  return function(err, req, res){
    var host = req.headers && req.headers.host;
    console.log(chalk.red('Proxy error:') + ' Could not proxy request ' + chalk.cyan(req.url) + ' from ' + chalk.cyan(host) + ' to ' + chalk.cyan(proxy) + '.');
    console.log('See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' + chalk.cyan(err.code) + ').');
    console.log();

    if (res.writeHead && !res.headersSent) {
      res.writeHead(500);
    }
    res.end('Proxy error: Could not proxy request ' + req.url + ' from ' +
      host + ' to ' + proxy + ' (' + err.code + ').'
    );
  }
}

function addMiddleware(devServer) {
  var proxy = require(paths.packageJson).proxy;
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: proxy ? ['text/html'] : ['text/html', '*/*']
  }));
  if (proxy) {
    if (typeof proxy !== 'string') {
      console.log(chalk.red('When specified, "proxy" in package.json must be a string.'));
      console.log(chalk.red('Instead, the type of "proxy" was "' + typeof proxy + '".'));
      console.log(chalk.red('Either remove "proxy" from package.json, or make it a string.'));
      process.exit(1);
    }

    var mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/;

    var hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
      target: proxy,
      logLevel: 'silent',
      onProxyReq: function(proxyReq, req, res) {
        if (proxyReq.getHeader('origin')) {
          proxyReq.setHeader('origin', proxy);
        }
      },
      onError: onProxyError(proxy),
      secure: false,
      changeOrigin: true,
      ws: true
    });
    devServer.use(mayProxy, hpm);
    devServer.listeningApp.on('upgrade', hpm.upgrade);
  }

  devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol) {
  var devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.src,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: protocol === "https",
    host: host
  });

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer);

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();

    if (isInteractive) {
      openBrowser(protocol + '://' + host + ':' + port + '/');
    }
  });
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? "https" : "http";
  var host = process.env.HOST || 'localhost';
  setupCompiler(host, port, protocol);
  runDevServer(host, port, protocol);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
console.log('DEFAULT_PORT', DEFAULT_PORT)
detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port);
    return;
  }

  if (isInteractive) {
    clearConsole();
    var existingProcess = getProcessForPort(DEFAULT_PORT);
    var question =
      chalk.yellow('Something is already running on port ' + DEFAULT_PORT + '.' +
        ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
        '\n\nWould you like to run the app on another port instead?';

    prompt(question, true).then(shouldChangePort => {
      if (shouldChangePort) {
        run(port);
      }
    }).catch(error => {
      console.log('Something went wrong here!');
      console.log(error.message);
    });
  } else {
    console.log(chalk.red('Something is already running on port ' + DEFAULT_PORT + '.'));
  }
}).catch(error => {
  console.log('Something went wrong!');
  console.log(error);
});
