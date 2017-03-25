import Core from 'utils/core';
import WebViewUtil from 'utils/web-view';
import Debugger from 'sketch-debugger';
import fetch, { handleResponses } from 'utils/fetch';

/**
 * NOTE: as eslint complains about unused vars and functions
 *  we add the ignore comment before every of the global
 *  entry functions
 */

// eslint-disable-next-line no-unused-vars
const helloWorld = function (context) {
  context.document.showMessage('Hello World');
  Debugger.log('Hello', 'World')
};

// eslint-disable-next-line no-unused-vars
const openWindow = function (context) {
  /**
   * It's good practise to handle the main function call with an
   * init function, that saves the context and all other necessary
   * variables for later usage
   */
  Core.initWithContext(context);
  WebViewUtil.Window.open(WebViewUtil.identifierWindow);
};

// eslint-disable-next-line no-unused-vars
const togglePanel = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Panel.toggle(WebViewUtil.identifierPanel);
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
const sendMessageToWindow = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Window.sendAction(WebViewUtil.identifierWindow, 'foo', {foo: 'bar'});
};

// eslint-disable-next-line no-unused-vars
const sendMessageToPanel = function (context) {
  Core.initWithContext(context);
  WebViewUtil.Panel.sendAction(WebViewUtil.identifierPanel, 'foo', {foo: 'bar'});
};

// eslint-disable-next-line no-unused-vars
const sendRequest = function (context) {
  Core.initWithContext(context);
  fetch('https://jsonplaceholder.typicode.com/posts/1').then(data => {
    log('async worked');
    log(data);
    Core.document.showMessage('Async rulez!')
  }).send();
}

// eslint-disable-next-line no-unused-vars
const handleHttpResponse = function(context) {
  Core.initWithContext(context);
  handleResponses();
}
