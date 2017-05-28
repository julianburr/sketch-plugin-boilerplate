process.env.NODE_ENV = 'production';

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var fs = require('fs-extra');
var chalk = require('chalk');

var config = require('../../config/plugin/rollup');
var paths = require('../../config/plugin/paths');
var fetch = require('sketch-fetch/lib/node');

var manifest = require('../../src/plugin/manifest.json');
var pkg = require('../../package.json');

// Start by clearing current build folder
console.log('Remove old plugin production build...');
fs.emptyDirSync(paths.build);

// Then start rollup
console.log('Create optimized production build...');
build();

function build () {
  rollup.rollup(config).then(function (bundle) {
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
  }).catch(function (error) {
    // Catch any possible parse errors
    console.log(chalk.red('Compile failed!'), error);
  });
}