var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var paths = require('./paths');
var resolve = require('rollup-plugin-node-resolve');

var babelConfig = require('./babel');

var plugins = [
  resolve({module: false}),
  babel(babelConfig),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(uglify());
}

module.exports = {
  // tell rollup our main entry point
  entry: paths.entry,
  exports: 'none',
  format: 'cjs',
  treeshake: false, // this is important in this case, otherwise handlers won't get output
  plugins: plugins
}
