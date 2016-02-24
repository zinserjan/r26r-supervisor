import React from 'react';
import ReactDOM from 'react-dom';
import renderClient from 'r26r-supervisor/lib/client';
import configure from 'r26r-supervisor/lib/configure';
import { useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import DevTools from './util/DevTools';
import createRoutes from './routes/createRoutes';
import * as reducers from './reducers';

const initialState = window.__data;

const {store, history} = configure({
  reducers,
  history: useRouterHistory(createBrowserHistory)({
    //basename: '/test',
  }),
  initialState,
  enhancers: [DevTools.instrument()],
});

const url = window.location.pathname + window.location.search + window.location.hash;

renderClient({
  store,
  initialState,
  routes: createRoutes(store),
  history,
  url
}, (component) => {
  ReactDOM.render(component, document.getElementById('app'));
  ReactDOM.render((<DevTools store={store}/>), document.getElementById('dev'));
});


if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const _ = require('lodash');
    const nextReducer = require('./reducers');
    store.replaceReducer(_.omit(nextReducer, ['default']));
  });
}
