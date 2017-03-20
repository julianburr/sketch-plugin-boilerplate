# Sketch Plugin Boilerplate

This is a basic JS boilerplate for creating [Sketch](https://www.sketchapp.com/) plugins, including custom GUIs build with JS (React). It bundles the code using [`rollup`](https://github.com/rollup/rollup) and [`rollup-plugin-babel`](https://github.com/rollup/rollup-plugin-babel), as well as [`webpack`](https://github.com/webpack/webpack) for the GUI side. Besides that it offers some other tweaks and helpers to make your life as a developer easier.

I used as little Objective C as possible, as this is really thought as an entry point for JS developers who don't want to deal with this side but still create awesome plugins.

## Get started
I recommend using [`yarn`](https://yarnpkg.com/), alternatively you can run the equivalent commands with `npm` as well. Also I recommend cloning the repo right into your Sketch plugin folder, cause it will development much faster and easier.

```bash
# Change to plugin folder
cd ~/Library/Application Support/com.bohemiancoding.sketch3/Plugins/

# Clone repo (as .sketchplugin!)
git clone https://github.com/julianburr/sketch-plugin-boilerplate.git sketch-plugin-boilerplate.sketchplugin
cd sketch-plugin-boilerplate.sketchplugin

# Install dependecies
yarn install

# ...and create a first build
yarn build
```

...and you're ready to go

## Folder structure
In the sample plugin you can see the expected folder structure. `src/plugin/index.js` is the entry point, the rest is wherever you want put it. Feel free to change the file structure to your needs. All you should be needing to do then is to adjust the paths defined in `config/plugin/paths.js` :)

The build structure is set according to the [Sketch Guidlines](http://developer.sketchapp.com/introduction/plugin-bundles/), so that the repo can be used as fully functional sketch plugin within the plugin folder (`~/Library/Application Support/com.bohemiancoding.sketch3/Plugins/`) for faster development.

## Scripts

**`yarn start`**

During development you don't want to manually rebuild every time you make a tiny little change. When running `yarn start` you create a development build (into the actual build folder structure, so Sketch automatically uses the files as a plugin) and stays alive watching for any changes. The bundled JS file is not minified (for better debugging) and a cache is used for faster rebuilding.

_NOTE: since it is much more convenient I split most of the scripts into `:plugin` and `:webview` as well, so you can start and watch your webview development by simply calling `yarn start:webview`_

**`yarn build`**

This command creates an uglified production build.

**`yarn lint` and `yarn lint-fix`**

Simply runs `eslint` and `eslint --fix` on the plugin source folder.

**`yarn bundle`**

Bundles the code into a `*.sketchplugin` folder ready to be pusblished or shared.

**`yarn todos`**

Basically just because I got tired of noting todos in my code and then forget about it 😅

##  Todos
 - [x] ~~eslint integration~~
 - [x] ~~React integration for webviews~~
 - [x] ~~simple support for xcode framework integration~~
 - [x] ~~sample implementation of web view in window (for custom GUI)~~
 - [x] ~~same for Panels (within the Sketch interface)~~ ~~*TODO: add action support*~~
 - [x] ~~integrate message handler to allow two way communication between web view and Sketch~~
 - [x] ~~set up redux for webviews + add actions to store as sample~~
 - [ ] make web view framework flexible, right now the plugin name is hard coded...
 - [ ] create simple HTTP request util for async requests (maybe better seperate?!)
 - [x] ~~create new repo for debugger tools + integrate them here as dependency~~ => see [`sketch-debugger`](https://github.com/julianburr/sketch-debugger)
 - [ ] test integration (jest? how can you write unit tests for sketch plugins?!)
 - [ ] make a GIF to show how fast and easy the setup is 😂
 - [ ] documentation / simple website
