import React, { Component } from 'react'
import { sendAction } from 'actions/bridge'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'

import sketchLogo from 'assets/sketch-logo.svg'
import 'styles/index.scss'

const mapStateToProps = state => {
  return {
    actions: state.bridge.actions,
    runBusyOnCocoaScriptState: state.bridge.runBusyOnCocoaScriptState,
    runBusyOnFrameworkState: state.bridge.runBusyOnFrameworkState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendAction: (name, payload) => dispatch(sendAction(name, payload))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class App extends Component {

  state = {
    busy: 'not_start',
  }

  sendMessage() {
    this.props.sendAction('foo', {foo: 'bar'})
  }

  runBusyOnWebView() {
    this.setState({ busy: 'busy' }, () => {
      for (let i=0; i < 10000000000; i++) {}
      this.setState({ busy: 'done' })
    })
  }

  runBusyOnCocoaScript() {
    this.props.sendAction('runBusyOnCocoaScript')
  }

  runBusyOnFramework() {
    this.props.sendAction('runBusyOnFramework')
  }

  render() {
    return (
      <div className="app">
        <img className='logo' src={sketchLogo} width={100} />
        <h1>Sketch Plugin Boilerplate</h1>
        <div className="app-content">
          <p>To get started, edit <code>src/webview/js/app.js</code> and save to reload.</p>
          <p><button onClick={this.sendMessage}>Send Action</button></p>
          {/*{this.props.actions.map(action => {*/}
          {/*  return <pre>{JSON.stringify(action, null, 2)}</pre>*/}
          {/*})}*/}
        </div>
        <div className="runtime-test-container">
          <div className="runtime-test">
            <button onClick={this.runBusyOnWebView}>
              Run Busy On WebView
            </button>
            {this.state.busy === 'done' && <p>Busy Done!</p>}
          </div>
          <div className="runtime-test">
            <button onClick={this.runBusyOnCocoaScript}>
              Run Busy On CocoaScript (default on Main Thread)
            </button>
            {this.props.runBusyOnCocoaScriptState === 'done' && <p>Busy Done!</p>}
          </div>
          <div className="runtime-test">
            <button onClick={this.runBusyOnFramework}>
              Run Busy On Framework on Background Thread
            </button>
            {this.props.runBusyOnFrameworkState === 'done' && <p>Busy Done!</p>}
          </div>
        </div>
      </div>
    )
  }
}
