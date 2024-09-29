import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import App from './components/App';
import  './index.css';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

root.render(
    <Provider store={store}>
      <BrowserRouter basename="/health-app-frontend">
      <App />
      </BrowserRouter>
    </Provider>
);
