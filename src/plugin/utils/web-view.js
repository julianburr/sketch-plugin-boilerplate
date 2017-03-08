import Core from 'utils/core';

export default {

  getFilePath (file) {
    return `${Core.pluginFolderPath}/Contents/Resources/webview/${file}`;
  },

  openWindow (path = 'index.html', width = 400, height = 350) {
    const identifier = 'satchel-plugin-boilerplate';
    const frame = NSMakeRect(0, 0, width, height);
    const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, NSTitledWindowMask|NSWindowStyleMaskClosable|NSResizableWindowMask, NSBackingStoreBuffered, false);
    
    // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
    // Otherwise the instance is stored nowhere and gets release => Window closes
    let threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[identifier] = window;
    
    const config = WKWebViewConfiguration.alloc().init();
    const messageHandler = SPBWebViewMessageHandler.alloc().init();
    config.userContentController().addScriptMessageHandler_name(messageHandler, 'Sketch');

    const webView = WKWebView.alloc().initWithFrame_configuration(frame, config);
    const url = NSURL.fileURLWithPath(this.getFilePath(path));

    webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    webView.loadRequest(NSURLRequest.requestWithURL(url));

    window.title = 'Sketch Debugger'
    window.center();
    window.contentView().addSubview(webView);

    window.makeKeyAndOrderFront(null);
  },

  openPanel (path = 'index.html', width = 250) {

  },

  findWindowOrPanel () {
    let threadDictionary = NSThread.mainThread().threadDictionary();
    return threadDictionary[identifier];
  },

  sendAction (name, payload = {}) {
    const webView = this.findWindowOrPanel();
    if (!webView || !webView.evaluateJavaScript) {
      return;
    }
    const script = `sketchBridge(${JSON.stringify({name, payload})});`;
    webView.evaluateJavaScript_completionHandler(script, null);
  },

  receiveAction (name, payload = {}) {
    Core.document.showMessage('I received a message! :)');
  }
}