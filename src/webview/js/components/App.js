import React, { Component } from 'react';
import 'styles/index.scss';

class App extends Component {
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
      </div>
    );
  }
}

export default App;