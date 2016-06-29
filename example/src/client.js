import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import renderClient from 'r26r-supervisor/lib/client';
import configure from 'r26r-supervisor/lib/configure';

import DevTools from './util/DevTools';
import createRoutes from './routes/createRoutes';
import * as reducers from './reducers';

const initialState = window.__data;

const { store, history } = configure({
  reducers,
  history: useRouterHistory(createBrowserHistory)({
    // basename: '/test',
  }),
  initialState,
  enhancers: [DevTools.instrument()],
});

const routes = createRoutes(store);

const beforeResolve = (renderProps) => {
  console.log('beforeResolve', renderProps);
};

const afterResolve = (renderProps) => {
  console.log('afterResolve', renderProps);
};

renderClient({
  store,
  initialState,
  routes,
  history,
  beforeResolve,
  afterResolve,
}, (error, redirectLocation, renderProps) => {
  const component = (
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>
  );

  ReactDOM.render(component, document.getElementById('app'));
  ReactDOM.render((<DevTools store={store} />), document.getElementById('dev'));
});


if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const _ = require('lodash');
    const nextReducer = require('./reducers');
    store.replaceReducer(_.omit(nextReducer, ['default']));
  });
}
