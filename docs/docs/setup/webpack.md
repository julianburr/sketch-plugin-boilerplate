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

#### Babel
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
        pluginUtils: './src/plugin/utils'
      }
    }]
  ]
}
```

## Webviews
The webpack config for the webviews was mostly taken from `create-react-app`. You can find the config in `config/webview/webpack-dev.js` and `config/webview/webpack-prod.js`.

#### Babel
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

# Notices
We add `jsconfig.json` file at the root directory; to sync the paths alias configuration of babel-plugin-module-resolver to **WebStorm**(Version >= 2019 3) or **VSCode**.

So the IDE works well as normal.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"],

      "pluginUtils/*": ["src/plugin/utils/*"],

      "webview/*": ["src/webview/*"],
      "actions/*": ["src/webview/js/actions/*"],
      "components/*": ["src/webview/js/components/*"],
      "reducers/*": ["src/webview/js/reducers/*"],
      "utils/*": ["src/webview/js/utils/*"],
      "assets/*": ["src/webview/assets/*"],
      "styles/*": ["src/webview/scss/*"]
    }
  }
}
```

* We just copy babel.js alias into jsconfig.json
* We use pluginUtils instead of utils cause there is already utils in webview
* We unify the js code of two projects(plugin & webview), because this actually is one project(code in plugin can easily access webview js code through evaluateJavaScript).
And I think unify them is a good decision.