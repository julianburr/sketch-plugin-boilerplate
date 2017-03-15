import WebViewCore from './web-view';
import WebViewWindow from './window';
import WebViewPanel from './panel';

export default {
  ...WebViewCore,

  Window: WebViewWindow,
  Panel: WebViewPanel
};