import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App, store} from './App';
import {Provider} from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
          {/*остальные страницы содержат код по теме Thunk с экзамена Чт2*/}
      </Provider>

  </React.StrictMode>
);



