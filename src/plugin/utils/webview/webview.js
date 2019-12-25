import { pluginFolderPath, document } from 'pluginUtils/core'
import ObjCClass from 'cocoascript-class'
import { findWebView as findWebViewFromPanel, findWebView as findWebViewFromWindow } from './panel'

// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
let windowIdentifier = 'sketch-plugin-boilerplate--window'
let panelIdentifier = 'sketch-plugin-boilerplate--panel'

// Since we now create the delegate in js, we need the enviroment
// to stick around for as long as we need a reference to that delegate
coscript.setShouldKeepAround(true)

// This is a helper delegate, that handles incoming bridge messages
export const BridgeMessageHandler = new ObjCClass({
  'userContentController:didReceiveScriptMessage:': function(controller, message) {
    try {
      const bridgeMessage = JSON.parse(String(message.body()))
      receiveAction(bridgeMessage.name, bridgeMessage.data)
    } catch (e) {
      log('Could not parse bridge message')
      log(e.message)
    }
  }
})

log('BridgeMessageHandler')
log(BridgeMessageHandler)
log(BridgeMessageHandler.userContentController_didReceiveScriptMessage)

export function initBridgedWebView(frame, bridgeName = 'SketchBridge') {
  const config = WKWebViewConfiguration.alloc().init()
  const messageHandler = BridgeMessageHandler.alloc().init()
  config.userContentController().addScriptMessageHandler_name(messageHandler, bridgeName)
  return WKWebView.alloc().initWithFrame_configuration(frame, config)
}

export function getFilePath(file) {
  return `${pluginFolderPath}/Contents/Resources/webview/${file}`
}

export function createWebView(path, frame) {
  const webView = initBridgedWebView(frame, 'Sketch')
  const url = NSURL.fileURLWithPath(getFilePath(path))
  log('File URL')
  log(url)

  webView.setAutoresizingMask(2 | 16)
  webView.configuration().preferences().setValue_forKey(true, 'developerExtrasEnabled')

  if (process.env.DEV) {
    webView.loadRequest(
      NSURLRequest.requestWithURL(
        NSURL.URLWithString('https://localhost:3000')
      )
    )
  } else {
    webView.loadRequest(NSURLRequest.requestWithURL(url))
  }

  return webView
}

export function sendAction(webView, name, payload = {}) {
  if (!webView || !webView.evaluateJavaScript_completionHandler) {
    return
  }
  // `sketchBridge` is the JS function exposed on window in the webview!
  const script = `sketchBridge('${JSON.stringify({name, payload})}');`
  webView.evaluateJavaScript_completionHandler(script, null)
}

export function receiveAction(name, payload = {}) {

  if (name === 'runBusyOnCocoaScript') {
    document.showMessage(`I received a message: ${name}, ${JSON.stringify(payload)}`)
    for (let i=0; i < 10000000000; i++) {}
    sendAction(findWebViewFromPanel(panelIdentifier), 'runBusyOnCocoaScriptDone', payload)
    sendAction(findWebViewFromWindow(windowIdentifier), 'runBusyOnCocoaScriptDone', payload)
    return
  }

  if (name === 'runBusyOnFramework') {
    document.showMessage(`I received a message: ${name}, ${JSON.stringify(payload)}`)
    for (let i=0; i < 10000000000; i++) {}
    sendAction(findWebViewFromPanel(panelIdentifier), 'runBusyOnFrameworkDone', payload)
    sendAction(findWebViewFromWindow(windowIdentifier), 'runBusyOnFrameworkDone', payload)
    return
  }

  document.showMessage(`I received a message: ${name}, ${JSON.stringify(payload)}`)
  sendAction(findWebViewFromPanel(panelIdentifier), name, payload)
  sendAction(findWebViewFromWindow(windowIdentifier), name, payload)
}

export {
  windowIdentifier,
  panelIdentifier
}
