import Core from 'utils/core';
import WebViewUtil from 'utils/web-view';

const helloWorld = function (context) {
  context.document.showMessage('Hello World')
};

const openWindow = function (context) {
  /**
   * It's good practise to handle the main function call with an
   * init function, that saves the context and all other necessary
   * variables for later usage
   */
  Core.initWithContext(context);
  context.document.showMessage('Open Window');
  log('###### test')
  WebViewUtil.openWindow();
}

const handleBridgeMessage = function (context) {
  log('handleBridgeMessage')
  Core.initWithContext(context);
  let data = SPBWebViewMessageUtils.getPayload();
  data = data ? JSON.parse(data) : {};
  WebViewUtil.receiveAction(data.name, data.payload);
}
