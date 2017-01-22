# Sketch Plugin Boilerplate

This is a basic boilerplate setup for creating [Sketch](https://www.sketchapp.com/) plugins. The main task of it is to bundle the JS code using [`rollup`](https://github.com/rollup/rollup) and [`rollup-plugin-babel`](https://github.com/rollup/rollup-plugin-babel). Besides that it offers some other tweaks and helpers to make your life as a developer easier.

## Get started
I recommend using [`yarn`](https://yarnpkg.com/), alternatively you can run the equivalent commands with `npm` as well. To get started install all the dependencies by running:

```yarn install```

## Folder structure
In the sample plugin you can see the expected folder structure. `src/plugin/index.js` is the entry point, the rest is wherever you put it. The subfolder is intended to allow space for extended development files, such as webviews, etc. Feel free to change the file structure to your needs. All you should be needing to do then is to adjust the paths defined in `config/plugin/paths.js` :)

The build structure is set according to the [Sketch Guidlines](http://developer.sketchapp.com/introduction/plugin-bundles/), so that all you need to do is to clone this repo into your Sketch Plugins folder (`/Users/[USER]/Library/Application Support/com.bohemiancoding.sketch3/Plugins/`) with the extension `.sketchplugin` and you are all good to go!

## Scripts
### `yarn start`
During development you don't want to manually rebuild every time you make a tiny little change. When running `yarn start` you create a development build (into the actual build folder structure, so Sketch automatically uses the files as a plugin) and stays alive watching for any changes. The bundled JS file is not minified (for better debugging) and a cache is used for faster rebuilding.

### `yarn build`
This command creates an uglified production build.

##  Todos
 - [x] ~~eslint integration~~
 - [ ] React integration for webviews
 - [ ] test integration
 - [ ] simple support for xcode framework integration
