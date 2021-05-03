import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-snapshot';

import Routes from './Routes';

render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);