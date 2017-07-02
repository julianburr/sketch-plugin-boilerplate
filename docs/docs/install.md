---
layout: docs
id: docs/getting-started
title: Installation & Setup
---

# Installation & Setup

```bash
# Change into your Sketch.app plugin directory
cd ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/

# Clone repo (as .sketchplugin!)
git clone https://github.com/julianburr/sketch-plugin-boilerplate.git sketch-plugin-boilerplate.sketchplugin
cd sketch-plugin-boilerplate.sketchplugin

# Install dependecies
yarn install

# ...and create a first build
yarn build
```

That's it! You are ready to go. During development you can simply run `yarn start:plugin`, and the changes will be moved into the right folders on save to be visible and testable within Sketch immedietly. How great is that :D