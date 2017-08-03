import { document } from 'utils/core';
import { toArray } from 'utils/formatter';
import { createWebView, sendAction as sendActionToWebView } from './web-view';

export function toggle (identifier, path, width) {
  if (isOpen(identifier)) {
    close(identifier);
  } else {
    open(identifier, path, width);
  }
}

export function open (identifier, path = 'index.html', options = {}) {
  const { width } = options;
  const frame = NSMakeRect(0, 0, width || 250, 600); // the height doesn't really matter here
  const contentView = document.documentWindow().contentView();
  if (!contentView || isOpen()) {
    return false;
  }

  const stageView = contentView.subviews().objectAtIndex(0);
  let webView = createWebView(path, frame);
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
}

export function close (identifier) {
  const contentView = document.documentWindow().contentView();
  if (!contentView) {
    return false;
  }
  // Search for web view panel
  const stageView = contentView.subviews().objectAtIndex(0);
  const finalViews = toArray(stageView.subviews()).filter(view => {
    return view.identifier() != identifier;
  });
  stageView.subviews = finalViews;
  stageView.adjustSubviews();
}

export function isOpen (identifier) {
  return !!findWebView(identifier);
}

export function findWebView (identifier) {
  const contentView = document.documentWindow().contentView();
  if (!contentView) {
    return false;
  }
  const splitView = contentView.subviews().objectAtIndex(0);
  const views = toArray(splitView.subviews());
  return views.find(view => view.identifier() == identifier);
}

export function sendAction (identifier, name, payload = {}) {
  return sendActionToWebView(findWebView(identifier));
}
