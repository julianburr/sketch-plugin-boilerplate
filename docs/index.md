---
layout: home
id: home
---

# Get Started

Let's say you want to name your project `MyProject` and locate it at `MyPath`

```bash
cd MyPath

git clone -b features https://github.com/colorgmi/sketch-plugin-boilerplate.git MyProject
# [todo: git clone https://github.com/julianburr/sketch-plugin-boilerplate.git MyProject]

cd MyProject

# Install dependencies
yarn

# Build and watch plugin (Backend: js code)
yarn start 
# Notice: need to restart Sketch when code changed 
# Because we set `coscript.setShouldKeepAround(true)` for convenience and never set it `false`, so this is a long running JavaScript context; so can't reload unless restart Sketch.

# Another terminal
# Build and watch webview (Frontend: js and scss code)
yarn start:webview 
# Notice: when it done, open your Safari of url https://localhost:3000/ 
# Then manually trust the localhost certificate in Keychain Access Application of Mac
# And then, Sketch webview can load https://localhost:3000/

# Then make a symbol link from your project to Sketch Plugin folder
# This will install Sketch plugin
cd ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/
mkdir MyProject.sketchplugin 
cd MyProject.sketchPlugin 
ln -s MyPath/MyProject/Contents .
```
Now, you can open Sketch Application, and open your plugin.
And you can change your frontend code, and backend code(need Sketch restart).
This way, you develop your plugin like a full stack developer.

```bash
# Bundle your project
yarn bundle
```
