---
layout: docs
id: utils/core
title: Utils &rsaquo; Core
---

# Core

## Usage Example

```js
import { document } from 'utils/core';
document.showMessage('Hello World!');
```

## Exports

### `initWithContext(context)`
Initializes the environment variables according to given context coming from Sketch. This method should ideally be the very first thing called in [any plugin entry function](.

### `loadFramework(frameworkName, frameworkClass)`
Load a cocoascript framework into your plugin enviroment. You have to load all desired classes seperately, they will then be available in the global namespace named after the framework class. E.g.:

```js
import { loadFramework } from 'utils/core';
loadFramework('MyFramework', 'AwesomeClass');

// This will now be available...
AwesomeClass.awesomeMethod();
```

### `context`
Sketch context that was sent with the plugin action call (or wherever `initWithContext` has been called!).

### `document`
Document retreived from context.

### `selection`
Current layer selection from context.

### `sketch`
Sketch JS API object.

Notice: here is set for null as a placeholder.

From `https://developer.sketch.com/reference/api`, you can write some code like below and export it
```js
export const sketch = require('sketch/dom')
export const async = require('sketch/async')
```

### `pluginFolderPath`
The absoulte plugin folder root path (retreived from initial context).