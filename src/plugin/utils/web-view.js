import Core from 'utils/core';
import Formatter from 'utils/formatter';

export default {
  identifier: 'satchel-plugin-boilerplate',

  getFilePath (file) {
    return `${Core.pluginFolderPath}/Contents/Resources/webview/${file}`;
  },

  createWebView (path, frame) {
    const config = WKWebViewConfiguration.alloc().init();
    const messageHandler = SPBWebViewMessageHandler.alloc().init();
    config.userContentController().addScriptMessageHandler_name(messageHandler, 'Sketch');

    const webView = WKWebView.alloc().initWithFrame_configuration(frame, config);
    const url = NSURL.fileURLWithPath(this.getFilePath(path));

    webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    webView.loadRequest(NSURLRequest.requestWithURL(url));

    return webView;
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

    const webView = this.createWebView(path, frame);

    window.title = 'Sketch Debugger';
    window.center();
    window.contentView().addSubview(webView);

    window.makeKeyAndOrderFront(null);
  },

  togglePanel (...args) {
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      this.openPanel(...args);
    }
  },

  openPanel (path = 'index.html', width = 250) {
    const frame = NSMakeRect(0, 0, width, 600); // the height doesn't really matter here
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView || this.isPanelOpen()) {
      return false;
    }

    const stageView = contentView.subviews().objectAtIndex(0);
    let webView = this.createWebView(path, frame);
    webView.identifier = this.identifier;

    // Inject our webview into the right spot in the subview list
    const views = stageView.subviews();
    let finalViews = [];
    let pushedWebView = false;
    for (let i = 0; i < views.count(); i++) {
      const view = views.objectAtIndex(i);
      finalViews.push(view);
      if (!pushedWebView && view.identifier() == 'view_canvas') {
        finalViews.push(webView);
        pushedWebView = true;
      }
    }
    // If it hasn't been pushed yet, push our web view
    // E.g. when inspector is not activated etc.
    if (!pushedWebView) {
      finalViews.push(webView);
    }
    // Finally, update the subviews prop and refresh
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
  },

  closePanel () {
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView) {
      return false;
    }
    // Search for web view panel
    const stageView = contentView.subviews().objectAtIndex(0);
    const finalViews = Formatter.toArray(stageView.subviews()).filter(view => {
      return view.identifier() != this.identifier;
    });
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
  },

  isPanelOpen () {
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView) {
      return false;
    }
    const splitView = contentView.subviews().objectAtIndex(0);
    const views = Formatter.toArray(splitView.subviews());
    return views.findIndex(view => view.identifier() == this.identifier) != -1;
  },

  findWindow () {
    let threadDictionary = NSThread.mainThread().threadDictionary();
    return threadDictionary[this.identifier];
  },

  sendAction (name, payload = {}) {
    const window = this.findWindow();
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
