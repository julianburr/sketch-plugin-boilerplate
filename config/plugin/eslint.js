module.exports = {
  "extends": ["semistandard"],
  "globals": {
    "MSDocument": false,
    "MSDocumentWindow": false,
    "MSPage": false,
    "MSSymbolInstance": false,
    "MSSymbolMaster": false,
    "MSTextLayer": false,
    "Mocha": false,
    "NSAlert": false,
    "NSApp": false,
    "NSClassFromString": false,
    "NSColor": false,
    "NSData": false,
    "NSDocument": false,
    "NSDocumentController": false,
    "NSFileManager": false,
    "NSImage": false,
    "NSJSONSerialization": false,
    "NSMakeRect": false,
    "NSMutableData": false,
    "NSMutableURLRequest": false,
    "NSSaveOperation": false,
    "NSString": false,
    "NSTextField": false,
    "NSTextView": false,
    "NSThread": false,
    "NSTitledWindowMask": false,
    "NSURL": false,
    "NSURLRequest": false,
    "NSUTF8StringEncoding": false,
    "NSUserDefaults": false,
    "NSView": false,
    "NSViewHeightSizable": false,
    "NSViewWidthSizable": false,
    "NSWindow": false,
    "NSWorkspace": false,
    "SatchelBridgeHelper": false,
    "SatchelSketchMessenger": false,
    "SatchelUtility": false
  },
  "parser": "babel-eslint",
  "plugins": [
    "no-unused-vars-rest"
  ],
  "rules": {
    "eqeqeq": [
      0
    ]
  }
}