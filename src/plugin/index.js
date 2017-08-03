import Core from 'utils/core';
import WebViewUtil from 'utils/web-view';

export const helloWorld = function (context) {
  Core.initWithContext(context);
  Core.document.showMessage('👋🌏 Hello World!');
};

export const openWindow = function (context) {
  // It's good practise to handle the main function call with an
  //  init function, that saves the context and all other necessary
  //  variables for later usage
  Core.initWithContext(context);
  WebViewUtil.Window.open(WebViewUtil.identifierWindow);
};

export const togglePanel = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Panel.toggle(WebViewUtil.identifierPanel);
};

export const handleBridgeMessage = function (context) {
  Core.initWithContext(context);
  let data = SPBWebViewMessageUtils.getPayload();
  WebViewUtil.receiveAction(data.name, data.payload);
};

export const sendMessageToWindow = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Window.sendAction(WebViewUtil.identifierWindow, 'foo', {foo: 'bar'});
};

export const sendMessageToPanel = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Panel.sendAction(WebViewUtil.identifierPanel, 'foo', {foo: 'bar'});
};
