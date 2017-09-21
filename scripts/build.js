process.env.NODE_ENV = 'production';

var fs = require('fs-extra');
var chalk = require('chalk');
var { logError } = require('./utils/build');

var buildPlugin = require('./plugin/build');
var buildWebView = require('./webview/build');

console.log(chalk.bold('Create production build'));
console.log();

console.log(chalk.grey.italic('Build plugin'));

buildPlugin({
  onOldBuildRemoved: () => {
    console.log('  ✓ Removed old build...');
  },

  onError: error => {
    logError(error);
  },

  onGlobalHandlersAdded: () => {
    console.log('  ✓ Added global handlers');
  },

  onManifestCopied: manifest => {
    console.log('  ✓ Copied manifest (version ' + manifest.version + ')');
  },

  onFrameworksCopied: () => {
    console.log('  ✓ Copied frameworks');
  },

  onSuccess: () => {
    console.log(chalk.green.bold('  ✓ Plugin compiled successfully'));
    console.log();

    console.log(chalk.grey.italic('Build web view'));

    buildWebView({
      onOldBuildRemoved: () => {
        console.log('  ✓ Removed old build...');
      },

      onError: error => {
        logError(error);
      },

      onSuccess: () => {
        console.log(chalk.green.bold('  ✓ Web view compiled successfully'));
        console.log();

        console.log(chalk.green.bold('✓ FINISHED BUILD '));
        console.log(
          chalk.grey.italic(
            'Run `yarn bundle` to create the final plugin bundle to be published.'
          )
        );
      }
    });
  }
});
