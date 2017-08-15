
![Image](http://dev.burrdesign.de/sketch-plugin-boilerplate-logo-20170702.svg)
 
<br>
<br>

# Sketch Plugin Boilerplate

The Sketch Plugin Boilerplate is targeted at JS Developers, who want to create awesome plugins for [Sketch](https://sketchapp.com), but don't want to have to go through all the Obj C frustrations to be able to do more complex stuff, like building GUIs, handling HTTP requests, etc.

I tried to use as little Obj C as possible, again, this is supposed to be a helpful starting point for JS developers.

<br>

> This is meant as a starting point, so clone the repo, modify anything and everything to your needs and build an awesome Sketch plugin

<br>

## Why
Sketch is awesome. And they provided us an awesome API to develop plugins. But as a JS Developer, there are still many things that are quiet hard to achieve. The main problem I keep hearing of is the ability to build custom user interfaces (GUIs), which requires some knowledge of how web views work in Obj C, how you can communicate with them and then **a lot of** boilerplate.

This repo should make it easier and faster to start new projects :)


## Getting started

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

... and you are ready to go :)


## Commands / Scripts

```bash
# Build and watch plugin (🔥, no need to run build every time to see changes in Sketch!)
yarn start

# Build and watch webview(s) in browser
yarn start:webview

# Compile everything into correct folder structure to use it in Sketch
yarn build

# Run eslint --fix on the source directory
yarn lint-fix

# Run Jest tests (needs Sketch / sketchtool installed locally)
yarn test
```

For the rest, see `package.json`


## Folder structure

**Why is the folder structure as it is**

The build structure follows [Sketch's guidelines](http://developer.sketchapp.com/introduction/plugin-bundles/) of how your plugin has to be structured. This makes development so much easier. All you have to do is to create the repo in your Sketch plugin folder (usually `~/Library/Application Support/com.bohemiancoding.sketch3/Plugins/`) and start coding. The watch and build scripts automatically put everything in the right place so you see the changes immediately in Sketch :)

```bash
└─── /__tests__ # Jest tests and assets (e.g. Sketch files, etc) that are used for test scenarios
└─── /config # Here you will find all necessary configurations, feel free to adjust them to your needs! :)
│
└─── /Contents  # This is the build folder that Sketch reads
│    └─── /Resources  # Assets, frameworks, etc.
│    └─── /Sketch  # plugin.js and manifest.json have to be here
│    
└─── /scripts  # The npm scripts, also feel free to change to your needs, this is a boilerplate, not an end product!
│    └─── /plugin  # For `yarn *:plugin` scripts
│    └─── /webview
│    
└─── /src  # Source code, split into the different parts of your plugin
│    └─── /framework  # Any xcode cocoa frameworks you want to load into your plugin
│    └─── /plugin  # The plugins JS source code
│    │    └─── index.js  # By default, this will be used to bundle your production plugin.js file
│    └─── /webview  # The source for possible web views
│    
└─── package.json  # By default, the version of your package.json will be copied into the plugins manifest.json
```

## Documentation

*In progress*

## Roadmap / Todos

 - [ ] Create useful documentation (integrated into a simple github.io page)
 - [ ] Create tutorials for JS developers to get started with Sketch plugins
 - [x] ~~Implement testing ([Jest](https://facebook.github.io/jest/)?)~~ *- Note: using [sketchtool](https://www.sketchapp.com/tool/) for accessing Sketch files and running plugin commands, however using own util functions, since the [node package](https://github.com/marekhrabe/sketchtool) does not seem to be maintained anymore (currently at version 39.x)*
 - [x] ~~Migrate the webview build from webpack to rollup, so we only have one build system to care about~~
 - [ ] Re-Implement `fetch` polyfill (see master before merge for old solution with cocoa framework and plugin action handler)
 - [x] ~~Try to get rid of cocoa framework if feasable~~

## About Testing

Testing is a bit of a question mark for Sketch plugins at the moment, as it's not that easy to unit test your plugin commands in the Sketch enviroment. I am currently working on a util library / plugin that lets you run and test Sketch commands with Jest or any similar JS unit testing framework. If you are interested, just hit me up, happy to share my progress on this and collaborate.