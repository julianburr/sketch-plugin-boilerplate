var fs = require('fs-extra');
var chalk = require('chalk');
var paths = require('../../config/plugin/paths');

function bundle ({ onOldBundleRemoved = () => {}, onSuccess = () => {} }) {
  // Start by clearing current build folder
  fs.emptyDirSync(paths.bundle);
  onOldBundleRemoved();

  fs.copySync(paths.bundleSrc, paths.bundle + '/Contents');

  // TODO: remove excluded files, such as Content/Resources/symbols/

  onSuccess(paths.bundle);
}

module.exports = bundle;
