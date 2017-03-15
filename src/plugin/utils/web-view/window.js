import Core from 'utils/core';
import WebViewCore from './web-view';

export default {
  open (identifier, path = 'index.html', width = 450, height = 350) {
    const frame = NSMakeRect(0, 0, width, height);
    const masks = NSTitledWindowMask |
      NSWindowStyleMaskClosable |
      NSResizableWindowMask;
    const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
    window.setMinSize({width: 200, height: 200});

    // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
    // Otherwise the instance is stored nowhere and gets release => Window closes
    let threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[identifier] = window;

    const webView = WebViewCore.createWebView(path, frame);

    window.title = 'Sketch Debugger';
    window.center();
    window.contentView().addSubview(webView);

    window.makeKeyAndOrderFront(null);
  },

  findWebView (identifier) {
    let threadDictionary = NSThread.mainThread().threadDictionary();
    const window = threadDictionary[identifier];
    return window.contentView().subviews()[0];
  },

  sendAction (identifier, name, payload = {}) {
    return WebViewCore.sendAction(this.findWebView(identifier), name, payload);
  }
};
