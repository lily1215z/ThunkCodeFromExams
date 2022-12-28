import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Provider} from 'react-redux';
import {App, store} from './App';
import {BrowserRouter} from 'react-router-dom';
// import {App, store} from './App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//
// root.render(<BrowserRouter><App/></BrowserRouter>)
//
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
          {/*остальные страницы содержат код по теме Thunk с экзамена Чт2*/}
      </Provider>

  </React.StrictMode>
);



