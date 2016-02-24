import React from 'react';
import { match, Router } from 'react-router';
import { Provider } from 'react-redux';
import loadClientState from './fetch/loadClientState';

export default function client({ store, routes, history, url, getLocals }, cb) {
  match({ routes, history, location: url }, () => {
    loadClientState({ store, routes, history, getLocals });

    const component = (
      <Provider store={store}>
        <Router routes={routes} history={history} />
      </Provider>
    );
    cb(component);
  });
}
