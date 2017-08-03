import { initWithContext, document } from 'utils/core';
import * as WebViewUtils from 'utils/web-view';

// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`

export function helloWorld (context) {
  initWithContext(context);
  document.showMessage('👋🌏 Hello World!');
};

export function openWindow (context) {
  // It's good practice to have an init function, that can be called
  // at the beginning of all entry points and will prepare the enviroment
  // using the provided `context`
  initWithContext(context);
  WebViewUtils.openWindow(WebViewUtils.windowIdentifier);
};

export function togglePanel (context) {
  initWithContext(context);
  WebViewUtils.togglePanel(WebViewUtils.panelIdentifier);
};

export function handleBridgeMessage (context) {
  initWithContext(context);
  let data = SPBWebViewMessageUtils.getPayload();
  WebViewUtils.receiveAction(data.name, data.payload);
};

export function sendMessageToWindow (context) {
  initWithContext(context);
  WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, 'foo', {foo: 'bar'});
};

export function sendMessageToPanel (context) {
  initWithContext(context);
  WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, 'foo', {foo: 'bar'});
};
