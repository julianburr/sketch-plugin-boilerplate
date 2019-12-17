---
layout: home
id: home
---

# Get Started

Let's say you want to name your project `MyProject` and locate it at `MyPath`

```bash
# setup your project

cd MyPath

git clone -b features https://github.com/colorgmi/sketch-plugin-boilerplate.git MyProject
# [todo: git clone https://github.com/julianburr/sketch-plugin-boilerplate.git MyProject]

# install dependencies
yarn

# watch sketch plugin js code (backend code) 
yarn start 
# Notice: need to restart Sketch when code changed 
# [todo: how to avoid this uncomfortable behaviour]

# another terminal to watch the code running in webview (frontend code)
yarn start:webview 
# Notice: when it done, open your Safari of url https://localhost:3000/ 
# Then manually trust the localhost certificate in Keychain Access Application of Mac
# And then, Sketch webview can load https://localhost:3000/

# then make a symbol link from your project to Sketch Plugin folder
cd ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/
mkdir MyProject.sketchplugin 
cd MyProject.sketchPlugin 
ln -s MyPath/MyProject/Contents .
```

When you want to publish, then bundle it
```bash
yarn bundle
```
And the MyProject.sketchplugin folder is the folder.