import {
  windowIdentifier,
  panelIdentifier,
  getFilePath,
  createWebView,
  sendAction as sendActionToWebView,
  receiveAction
} from './webview';

import {
  fetchExample
} from './utils';

import {
  open as openWindow,
  sendAction as sendWindowAction
} from './window';

import {
  toggle as togglePanel,
  open as openPanel,
  close as closePanel,
  isOpen as isPanelOpen,
  sendAction as sendPanelAction
} from './panel';

export {
  windowIdentifier,
  panelIdentifier,
  getFilePath,
  createWebView,
  sendActionToWebView,
  receiveAction,

  fetchExample,

  openWindow,
  sendWindowAction,

  togglePanel,
  openPanel,
  closePanel,
  isPanelOpen,
  sendPanelAction
};
