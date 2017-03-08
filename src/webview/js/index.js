import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import { bridge as sketchBridge } from 'utils/sketch';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

window.sketchBridge = sketchBridge;