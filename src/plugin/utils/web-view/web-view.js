import { pluginFolderPath, document } from 'utils/core';

// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
let windowIdentifier = 'sketch-plugin-boilerplate--window';
let panelIdentifier = 'sketch-plugin-boilerplate--panel';

export function getFilePath (file) {
  return `${pluginFolderPath}/Contents/Resources/webview/${file}`;
}

export function createWebView (path, frame) {
  const config = WKWebViewConfiguration.alloc().init();
  const messageHandler = SPBWebViewMessageHandler.alloc().init();
  config.userContentController().addScriptMessageHandler_name(messageHandler, 'Sketch');

  const webView = WKWebView.alloc().initWithFrame_configuration(frame, config);
  const url = NSURL.fileURLWithPath(getFilePath(path));
  log('File URL')
  log(url)

  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
  webView.loadRequest(NSURLRequest.requestWithURL(url));

  return webView;
}

export function sendAction (webView, name, payload = {}) {
  if (!webView || !webView.evaluateJavaScript_completionHandler) {
    return;
  }
  // `sketchBridge` is the JS function exposed on window in the webview!
  const script = `sketchBridge('${JSON.stringify({name, payload})}');`;
  const check = webView.evaluateJavaScript_completionHandler(script, null);
}

export function receiveAction (name, payload = {}) {
  document.showMessage('I received a message! 😊🎉🎉');
}

export {
  windowIdentifier,
  panelIdentifier
};
