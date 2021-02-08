


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import  {NavEditor}  from './components/NavbarEditor';
import SchemaEditor from './components/SchemaEditor'
import { Provider } from 'react-redux';
import store from './store';
import {App} from './App'
import TabEditor from './components/TabMenu'
import ToolbarEditor from './components/Toolbar'
ReactDOM.render(
  <Provider store={store}>
    <NavEditor></NavEditor>
    <ToolbarEditor></ToolbarEditor>
    <App/>
  </Provider>

,
  document.getElementById('root')
);

