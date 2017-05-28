process.env.NODE_ENV = 'development';

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var fs = require('fs-extra');
var chalk = require('chalk');
var watch = require('watch')

var config = require('../../config/plugin/rollup');
var paths = require('../../config/plugin/paths');

var manifest = require('../../src/plugin/manifest.json');
var pkg = require('../../package.json');
var fetch = require('sketch-fetch/lib/node');

var watching = false;

// Start by clearing current build folder
console.log('Remove old build...');
fs.emptyDirSync(paths.build);

// Then start rollup
console.log('Create development production build...');
build();

function build () {
  // Just log a notice when we are in watch mode and detected changes!
  if (watching) {
    console.log();
    console.log('Change detected...');
  }

  rollup.rollup(config).then(function (bundle) {
    // Save bundle in cache for faster builds
    config.cache = bundle;

    // Write bundle to file
    console.log('Bundle rolled up...');
    bundle.write({
      format: 'cjs',
      dest: 'Contents/Sketch/plugin.js',
      exports: 'none',
      sourceMap: true
    });

    // Copy manifest.json + add version number form manifest
    console.log('Copy manifest (version ' + pkg.version + ')');
    manifest.version = pkg.version;
    fs.outputJson(paths.build + '/manifest.json', manifest);

    // Copy framework(s)
    console.log('Copy frameworks');
    fs.emptyDirSync(paths.frameworksBuild);
    var list = fs.readdirSync(paths.frameworks);
    list.forEach(function (item) {
      if (item.endsWith('.framework')) {
        fs.copySync(paths.frameworks + '/' + item, paths.frameworksBuild + '/' + item);
      }
    });
    fetch.copyFrameworks(paths.frameworksBuild);

    // Done :)
    console.log(chalk.green('✓ Compiled successfully.'));
    console.log();

    // Start watching
    if (!watching) {
      console.log(chalk.yellow('Start watching...'));
      watching = true;
      [paths.src, paths.frameworks].forEach(function (root) {
        watch.createMonitor(root, function (monitor) {
          monitor.on("created", build);
          monitor.on("changed", build);
          monitor.on("removed", build);
        });
      });
    }
  }).catch(function (e) {
    // Catch any possible parse errors
    console.log(chalk.red('Compile failed!'), e);
  });
}