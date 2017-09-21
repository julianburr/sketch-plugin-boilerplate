var path = require('path');
var fs = require('fs-extra');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp (relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var src = resolveApp('src/plugin');
var frameworks = resolveApp('src/frameworks');

module.exports = {
  src,
  entry: resolveApp('src/plugin/index.js'),
  manifest: resolveApp('src/plugin/manifest.json'),
  changelog: resolveApp('changelog.json'),
  changelogMarkdown: resolveApp('./CHANGELOG.md'),
  appcast: resolveApp('bundles/appcast.xml'),
  build: resolveApp('Contents/Sketch'),
  bundleSrc: resolveApp('Contents'),
  bundle: resolveApp('sketch-plugin-boilerplate.sketchplugin'),
  bundles: resolveApp('bundles'),
  frameworks,
  frameworksBuild: resolveApp('Contents/Resources/frameworks'),
  watch: [ src, frameworks ]
};
