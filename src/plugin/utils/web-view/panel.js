import Core from 'utils/core';
import Formatter from 'utils/formatter';
import WebViewCore from './web-view';

export default {
  toggle (identifier, path, width) {
    if (this.isOpen(identifier)) {
      this.close(identifier);
    } else {
      this.open(identifier, path, width);
    }
  },

  open (identifier, path = 'index.html', width = 250) {
    const frame = NSMakeRect(0, 0, width, 600); // the height doesn't really matter here
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView || this.isOpen()) {
      return false;
    }

    const stageView = contentView.subviews().objectAtIndex(0);
    let webView = WebViewCore.createWebView(path, frame);
    webView.identifier = identifier;

    // Inject our webview into the right spot in the subview list
    const views = stageView.subviews();
    let finalViews = [];
    let pushedWebView = false;
    for (let i = 0; i < views.count(); i++) {
      const view = views.objectAtIndex(i);
      finalViews.push(view);
      // NOTE: change the view identifier here if you want to add
      //  your panel anywhere else 
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

  close (identifier) {
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView) {
      return false;
    }
    // Search for web view panel
    const stageView = contentView.subviews().objectAtIndex(0);
    const finalViews = Formatter.toArray(stageView.subviews()).filter(view => {
      return view.identifier() != identifier;
    });
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
  },

  isOpen (identifier) {
    return !!this.findWebView(identifier);
  },

  findWebView (identifier) {
    const contentView = Core.document.documentWindow().contentView();
    if (!contentView) {
      return false;
    }
    const splitView = contentView.subviews().objectAtIndex(0);
    const views = Formatter.toArray(splitView.subviews());
    return views.find(view => view.identifier() == identifier);
  },

  sendAction (identifier, name, payload = {}) {
    return WebViewCore.sendAction(this.findWebView(identifier));
  }
};
