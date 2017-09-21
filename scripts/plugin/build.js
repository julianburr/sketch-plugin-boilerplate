var fs = require('fs-extra');
var webpack = require('webpack');

var webpackConfig = require('../../config/plugin/webpack');
var paths = require('../../config/plugin/paths');

var manifest = require('../../src/plugin/manifest.json');
var pkg = require('../../package.json');

function build ({
  options = {},
  onOldBuildRemoved = () => {},
  onError = () => null,
  onSuccess = () => {},
  onGlobalHandlersAdded = () => {},
  onManifestCopied = () => {},
  onFrameworksCopied = () => {}
}) {
  fs.emptyDirSync(paths.build);

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

    // HACK!
    // Add global handlers
    manifest.commands.forEach(command => {
      var file = paths.build + '/' + command.script;
      var compiled = fs.readFileSync(file);
      compiled +=
        '\n\nvar ' + command.handler + ' = handlers.' + command.handler + ';';
      fs.writeFileSync(file, compiled);
    });
    onGlobalHandlersAdded(manifest.commands);

    // Copy manifest.json + add version number form manifest
    // manifest.version = pkg.version;
    // fs.outputJson(paths.build + '/manifest.json', manifest);
    // onManifestCopied(manifest);

    // Copy framework(s)
    if (fs.existsSync(paths.frameworks)) {
      var list = fs.readdirSync(paths.frameworks);
      var frameworks = list.filter(item => item.endsWith('.framework'));
      if (frameworks.length) {
        fs.emptyDirSync(paths.frameworksBuild);
        frameworks.forEach(item => {
          fs.copySync(
            paths.frameworks + '/' + item,
            paths.frameworksBuild + '/' + item
          );
        });
        onFrameworksCopied(frameworks);
      }
    }

    // Done :)
    onSuccess();
  });
}

module.exports = build;
