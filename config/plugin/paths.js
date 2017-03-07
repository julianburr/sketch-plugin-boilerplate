var path = require('path');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp);

module.exports = {
  src: resolveApp('src/plugin'),
  entry: resolveApp('src/plugin/index.js'),
  manifest: resolveApp('src/plugin/manifest.json'),
  build: resolveApp('Contents/Sketch'),
  bundle: resolveApp('sketch-plugin-boilerplate.sketchplugin'),
  frameworks: resolveApp('src/frameworks'),
  frameworksBuild: resolveApp('Contents/Resources/frameworks'),
  packageJson: resolveApp('package.json'),
  nodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths
};
