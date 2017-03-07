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
    
    const webConfig = WKWebViewConfiguration.alloc().init();
    const webView = WKWebView.alloc().initWithFrame_configuration(frame, webConfig);
    const fullUrl = NSURL.fileURLWithPath(this.getFilePath(path));

    webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    webView.loadRequest(NSURLRequest.requestWithURL(fullUrl));

    window.title = 'Sketch Debugger'
    window.center();
    window.contentView().addSubview(webView);

    window.makeKeyAndOrderFront(null);
  }
}