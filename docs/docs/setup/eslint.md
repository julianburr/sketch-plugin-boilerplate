---
layout: docs
id: setup/eslint
title: Setup &rsaquo; ESLint
---

# ESLint

## Plugin
Uses semistandard. On top of that defines all globals for exposed sketch classes and some other globals available through Cocoascript environment.

Also disables `eqeqeq` rule, as it is not really feasable in Cocoascript, due to the various different types you are dealing with (NSString == string, but NSString !== string).

```js
module.exports = {
  extends: ['semistandard'],
  globals: {
    MSDocument: false,
    MSDocumentWindow: false,
    MSPage: false,
    MSSymbolInstance: false,
    MSSymbolMaster: false,
    MSTextLayer: false,
    NSAlert: false,
    NSApp: false,
    NSClassFromString: false,
    NSColor: false,
    NSData: false,
    NSDocument: false,
    NSDocumentController: false,
    NSFileManager: false,
    NSImage: false,
    NSJSONSerialization: false,
    NSMakeRect: false,
    NSMutableData: false,
    NSMutableURLRequest: false,
    NSSaveOperation: false,
    NSString: false,
    NSTextField: false,
    NSTextView: false,
    NSThread: false,
    NSTitledWindowMask: false,
    NSURL: false,
    NSURLRequest: false,
    NSUTF8StringEncoding: false,
    NSUserDefaults: false,
    NSView: false,
    NSViewHeightSizable: false,
    NSViewWidthSizable: false,
    NSWindow: false,
    NSWorkspace: false,
    WKWebView: false,
    WKWebViewConfiguration: false,
    Mocha: false,
    log: false,
    NSBackingStoreBuffered: false,
    NSPanel: false,
    NSResizableWindowMask: false,
    NSWindowStyleMaskClosable: false,
    SPBWebViewMessageHandler: false,
    SPBWebViewMessageUtils: false
  },
  parser: 'babel-eslint',
  plugins: [
    'no-unused-vars-rest'
  ],
  rules: {
    eqeqeq: [
      0
    ]
  }
}
```

## Webviews
Standard react app eslint rule set.

```js
module.exports = {
  plugins: ['react'],
  extends: ['semistandard'],
  env: {
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }
}
```
