import Core from 'utils/core';

export default {
  identifier: 'satchel-plugin-boilerplate',

  getFilePath (file) {
    return `${Core.pluginFolderPath}/Contents/Resources/webview/${file}`;
  },

  openWindow (path = 'index.html', width = 450, height = 350) {
    const frame = NSMakeRect(0, 0, width, height);
    const masks = NSTitledWindowMask |
      NSWindowStyleMaskClosable |
      NSResizableWindowMask;
    const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
    window.setMinSize({width: 200, height: 200});

    // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
    // Otherwise the instance is stored nowhere and gets release => Window closes
    let threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[this.identifier] = window;

    const config = WKWebViewConfiguration.alloc().init();
    const messageHandler = SPBWebViewMessageHandler.alloc().init();
    config.userContentController().addScriptMessageHandler_name(messageHandler, 'Sketch');

    const webView = WKWebView.alloc().initWithFrame_configuration(frame, config);
    const url = NSURL.fileURLWithPath(this.getFilePath(path));

    webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    webView.loadRequest(NSURLRequest.requestWithURL(url));

    window.title = 'Sketch Debugger';
    window.center();
    window.contentView().addSubview(webView);

    window.makeKeyAndOrderFront(null);
  },

  openPanel (path = 'index.html', width = 250) {

  },

  findWindowOrPanel () {
    let threadDictionary = NSThread.mainThread().threadDictionary();
    return threadDictionary[this.identifier];
  },

  sendAction (name, payload = {}) {
    const window = this.findWindowOrPanel();
    const webView = window.contentView().subviews()[0];
    log('webView');
    log(webView);
    log(webView.evaluateJavaScript_completionHandler);
    if (!webView || !webView.evaluateJavaScript_completionHandler) {
      return;
    }
    const script = `sketchBridge('${JSON.stringify({name, payload})}');`;
    const check = webView.evaluateJavaScript_completionHandler(script, null);
    log('check');
    log(script);
    log(check);
  },

  receiveAction (name, payload = {}) {
    Core.document.showMessage('I received a message! :)');
  }
};
