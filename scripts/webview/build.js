var fs = require('fs-extra');
var chalk = require('chalk');
var webpack = require('webpack');

var webpackConfig = require('../../config/webview/webpack-prod');
var paths = require('../../config/webview/paths');

function build ({
  onOldBuildRemoved = () => null,
  onError = () => null,
  onSuccess = () => {}
}) {
  fs.emptyDirSync(paths.build);
  onOldBuildRemoved();

  webpack(webpackConfig).run((err, stats) => {
    // Catch all errors
    var error = null;
    if (err) {
      error = err;
    } else if (stats.compilation.errors.length) {
      error = stats.compilation.errors;
    } else if (process.env.CI && stats.compilation.warnings.length) {
      error = stats.compilation.warnings;
    }

    if (error) {
      onError(error);
      return;
    }

    onSuccess();
  });
}

module.exports = build;
