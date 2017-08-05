---
layout: docs
id: utils/fetch
title: Setup &rsaquo; Webpack
---

# Webpack

## Plugin
The plugin simply bundles to a handlers variable.

```js
module.exports = {
  entry: paths.entry,
  output: {
    path: paths.build,
    filename: 'plugin.js',
    library: 'handlers',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  }
}
```

### Babel
Allows you to use ES6 syntax in your plugin code which will be transformed at build time. Also defined alias for `utils` folder.

```js
module.exports = {
  presets: [
    ['es2015', {
      modules: false
    }]
  ],
  'plugins': [
    'transform-object-rest-spread',
    ['module-resolver', {
      alias: {
        utils: './src/plugin/utils'
      }
    }]
  ]
}
```

## Webviews
The webpack config for the webviews was mostly taken from `create-react-app`. You can find the config in `config/webview/webpack-dev.js` and `config/webview/webpack-prod.js`.

### Babel
React preset, as well as several aliases for convenience.

```js
module.exports = {
  presets: ['react-app'],
  plugins: [
    'transform-object-rest-spread',
    'transform-decorators-legacy',
    ['module-resolver', {
      alias: {
        webview: './src/webview',
        components: './src/webview/js/components',
        actions: './src/webview/js/actions',
        reducers: './src/webview/js/reducers',
        utils: './src/webview/js/utils',
        assets: './src/webview/assets',
        styles: './src/webview/scss'
      }
    }]
  ],
}
```