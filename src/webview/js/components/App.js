import React, { Component } from 'react';
import { sendAction } from 'utils/sketch';
import 'styles/index.scss';
import { autobind } from 'core-decorators';

@autobind
export default class App extends Component {
  constructor () {
    super();
    this.state = {
      buttonText: 'Send Message'
    };
  }

  sendMessage () {
    console.log('sendAction', sendAction)
    sendAction('foo', {foo: 'bar'}).then(() => {
      this.setState({buttonText: 'Message sent...'});
    }).catch(error => {
      this.setState({buttonText: 'Failed to send :('});
    });
  }

  render() {
    return (
      <div className="App">
        <div id="logo" />
        <div className="App-header">
          <h2>Welcome</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/webview/components/App.js</code> and save to reload. I can see this...
        </p>
        <p>
          <button onClick={this.sendMessage}>{this.state.buttonText}</button>
        </p>
      </div>
    );
  }
}
