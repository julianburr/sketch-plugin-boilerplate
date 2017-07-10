process.env.NODE_ENV = 'development';

var fs = require('fs-extra');
var chalk = require('chalk');
var watch = require('watch');
var clear = require('clear');
var update = require('log-update');
var webpack = require('webpack');

var config = require('../../config/plugin/webpack');
var paths = require('../../config/plugin/paths');

var manifest = require('../../src/plugin/manifest.json');
var pkg = require('../../package.json');
var fetch = require('sketch-fetch/lib/node');

var watching = false;
var timer = null;

// Start by clearing current build folder
clear();
console.log('Remove old build...');
fs.emptyDirSync(paths.build);

// Then start rollup
build();

function build () {
  // Just log a notice when we are in watch mode and detected changes!
  if (watching) {
    clear();
    console.log(chalk.yellow('Change detected...'));
    console.log();
  }

  console.log('Create development production build...');
  console.log();

  webpack(config).run((err, stats) => {
    // Catch all errors
    if (err) {
      logError(err);
      return;
    }

    if (stats.compilation.errors.length) {
      logError(stats.compilation.errors);
      return;
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      logError(stats.compilation.warnings);
      return;
    }

    // HACK!
    // Add global handlers
    console.log('  ✓ Add global handlers');
    manifest.commands.forEach(function (command) {
      var file = paths.build + '/' + command.script;
      var compiled = fs.readFileSync(file);
      compiled += "\n\nvar " + command.handler + " = handlers." + command.handler + ";";
      fs.writeFileSync(file, compiled);
    });

    // Copy manifest.json + add version number form manifest
    console.log('  ✓ Copy manifest (version ' + pkg.version + ')');
    manifest.version = pkg.version;
    fs.outputJson(paths.build + '/manifest.json', manifest);

    // Copy framework(s)
    console.log('  ✓ Copy frameworks');
    fs.emptyDirSync(paths.frameworksBuild);
    var list = fs.readdirSync(paths.frameworks);
    list.forEach(function (item) {
      if (item.endsWith('.framework')) {
        fs.copySync(paths.frameworks + '/' + item, paths.frameworksBuild + '/' + item);
      }
    });
    fetch.copyFrameworks(paths.frameworksBuild);

    // Done :)
    console.log(chalk.green.bold('  ✓ Compiled successfully'));
    console.log();
    
    // Watch source files for changes
    observe();
  });
}

function observe () {
  var start = new Date();
  console.log(chalk.yellow('Start watching...'));

  if (watching) {
    // HACK
    // for some reason on re-painting update deletes
    // the line before it, so we throw an empty one in here
    console.log();
  }

  // Initialize timer text
  update(chalk.grey('Just now'));

  // Set interval to update the timer text, so we can
  // see more easily if a rebuild has just happened
  clearInterval(timer);
  timer = setInterval(() => {
    update(chalk.grey(diffText(start)));
  }, 10000);

  if (!watching) {
    watching = true;
    [paths.src, paths.frameworks].forEach(function (root) {
      watch.createMonitor(root, function (monitor) {
        monitor.on("created", build);
        monitor.on("changed", build);
        monitor.on("removed", build);
      });
    });
  }
}

function logError (error) {
  console.log(chalk.bgRed('Compilation failed'));
  console.log(chalk.grey(error));
  console.log();
  clearInterval(timer);
}

function diffText (start) {
  var diff = (new Date() - start) / 1000;
  if (diff < 60) {
    txt = 'Moments ago'
  } else if (diff < 60 * 60) {
    txt = Math.round(diff / 60) + 'mins ago';
  } else if (diff < 60 * 60 * 10) {
    txt = Math.round(diff / (60 * 10)) + 'hrs ago';
  } else {
    txt = 'A long time ago'
  }
  return txt;
}