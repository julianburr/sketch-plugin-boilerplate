var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var resolve = require('rollup-plugin-node-resolve');

var paths = require('./paths');
var babelConfig = require('./babel');

var plugins = [
  resolve({module: false}),
  babel(babelConfig),
];

// Uglify breaks the build process, so disabled for now
// if (process.env.NODE_ENV === 'production') {
//   plugins.push(uglify());
// }

module.exports = {
  // Tell rollup our main entry point
  entry: paths.entry,
  exports: 'none',
  format: 'cjs',
  treeshake: false, // This is important in this case, otherwise handlers won't get output
  plugins: plugins,
  sourceMap: true
}
