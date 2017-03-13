import Core from 'utils/core';
import WebViewUtil from 'utils/web-view';

/**
 * NOTE: as eslint complains about unused vars and functions
 *  we add the ignore comment before every of the global
 *  entry functions
 */

// eslint-disable-next-line no-unused-vars
const helloWorld = function (context) {
  context.document.showMessage('Hello World');
};

// eslint-disable-next-line no-unused-vars
const openWindow = function (context) {
  /**
   * It's good practise to handle the main function call with an
   * init function, that saves the context and all other necessary
   * variables for later usage
   */
  Core.initWithContext(context);
  WebViewUtil.openWindow();
};

// eslint-disable-next-line no-unused-vars
const openPanel = function (context) {
  Core.initWithContext(context);
  WebViewUtil.togglePanel();
};

// eslint-disable-next-line no-unused-vars
const handleBridgeMessage = function (context) {
  Core.initWithContext(context);
  let data = SPBWebViewMessageUtils.getPayload();
  try {
    data = JSON.parse(data);
  } catch (err) {
    log(err.message);
    log(err.stack);
    return;
  }
  WebViewUtil.receiveAction(data.name, data.payload);
};

// eslint-disable-next-line no-unused-vars
const sendBridgeMessage = function (context) {
  Core.initWithContext(context);
  WebViewUtil.sendAction('foo', {foo: 'bar'});
};
