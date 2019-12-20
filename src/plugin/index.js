import { initWithContext, document } from 'pluginUtils/core'
import * as WebViewUtils from 'pluginUtils/webview'

// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`

export function helloWorld(context) {
  initWithContext(context)
  document.showMessage('👋🌏 Hello World!')
}

export function openWindow(context) {
  // It's good practice to have an init function, that can be called
  // at the beginning of all entry points and will prepare the enviroment
  // using the provided `context`
  initWithContext(context)
  WebViewUtils.openWindow(WebViewUtils.windowIdentifier)
}

export function togglePanel(context) {
  initWithContext(context)
  WebViewUtils.togglePanel(WebViewUtils.panelIdentifier)
}

export function sendMessageToWindow(context) {
  initWithContext(context)
  WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, 'foo', {foo: 'bar'})
}

export function sendMessageToPanel(context) {
  initWithContext(context)
  WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, 'foo', {foo: 'bar'})
}

export async function sendRequest(context) {
  initWithContext(context)
  const result = await WebViewUtils.fetchExample()
  document.showMessage(`I fetched ${JSON.stringify(result)}`)
}