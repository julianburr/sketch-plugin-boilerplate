process.env.NODE_ENV = 'production';

var fs = require('fs-extra');
var chalk = require('chalk');
var { logError } = require('./utils/build');

var buildPlugin = require('./plugin/build');
var buildWebView = require('./webview/build');
var bundlePlugin = require('./plugin/bundle');

console.log(chalk.bold('Building and bundling plugin'));
console.log();
console.log(chalk.grey.italic('Building plugin and web view'));

buildPlugin({
  onError: error => {
    logError(error);
  },

  onSuccess: () => {
    console.log('  ✓ Plugin compiled successfully');
    buildWebView({
      onError: error => {
        logError(error);
      },

      onSuccess: () => {
        console.log('  ✓ Web view compiled successfully');
        console.log(chalk.green.bold('  ✓ Finished build'));

        console.log();
        console.log(chalk.grey.italic('Creating .sketchplugin bundle'));

        bundlePlugin({
          onError: error => {
            logError(error);
          },

          onSuccess: () => {
            console.log(chalk.green.bold('  ✓ Created bundle'));

            console.log();
            console.log(chalk.green.bold('DONE!'));
            console.log();
          }
        });
      }
    });
  }
});
