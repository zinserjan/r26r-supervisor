import React from 'react';
import ReactDOM from 'react-dom';
import { createStore }from 'r26r-supervisor';
import renderClient from 'r26r-supervisor/lib/client';
import { useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import DevTools from './util/DevTools';
import createRoutes from './routes/createRoutes';
import * as reducers from './reducers';

const initialState = window.__data;

const history = useRouterHistory(createBrowserHistory)({
  //basename: '/test',
});

const store = createStore({
  reducers,
  history,
  initialState,
  enhancers: [DevTools.instrument()],
});

const url = window.location.pathname + window.location.search + window.location.hash;

renderClient({
  store,
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
