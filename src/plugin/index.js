import { initWithContext, document } from 'utils/core';
import * as WebViewUtils from 'utils/webview';
import fetch from 'utils/fetch';

// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`

export function helloWorld (context) {
  initWithContext(context);
  document.showMessage('👋🌏 Hello World!');
}

export function openWindow (context) {
  // It's good practice to have an init function, that can be called
  // at the beginning of all entry points and will prepare the enviroment
  // using the provided `context`
  initWithContext(context);
  WebViewUtils.openWindow(WebViewUtils.windowIdentifier);
}

export function togglePanel (context) {
  initWithContext(context);
  WebViewUtils.togglePanel(WebViewUtils.panelIdentifier);
}

export function sendMessageToWindow (context) {
  initWithContext(context);
  WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, 'foo', {foo: 'bar'});
}

export function sendMessageToPanel (context) {
  initWithContext(context);
  WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, 'foo', {foo: 'bar'});
}

export function sendRequest (context) {
  initWithContext(context);
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(() => {
      log('This gets resolved!');
    });
}
