---
layout: docs
id: utils/webview
title: Utils &rsaquo; Webview
---

# Webview

## Usage Example

```js
import { createWebView } from 'utils/webview';
const myWebView = createWebView('Hello World!');
```

## Exports

### `getFilePath(relativePath)`

### `createWebView(path, frame)`

### `sendActionToWebView(name, payload)`

### `receiveAction(name, payload)`

## Window
These are abstractions on top of the webview utils to open a webview in a window (as a modal).

### `openWindow(id, path, { width, height }`

### `sendWindowAction(id, name, payload)`

## Panel
Abstractions on top of the webview utils to open a webview as a side panel as part of the Sketch UI.

### `openPanel(id, path, { width })`

### `closePanel()`

### `togglePanel(id, path, { width })`

### `sendPanelAction(id, name, payload)`

