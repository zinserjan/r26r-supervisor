import React from 'react';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import loadServerState from './fetch/loadServerState';
import { parsePath } from 'history/lib/PathUtils';

export default function server({ store, routes, history, url, getLocals }, cb) {
  match({ routes, history, location: url }, (error, redirectLocation, renderProps) => {
    if (error) {
      cb(error, null, null, null); // error
      history.unsubscribe(); // stop the syncing process of store with history
    } else if (redirectLocation) {
      cb(null, redirectLocation, null, null); // redirect
      history.unsubscribe(); // stop the syncing process of store with history
    } else if (!renderProps) {
      cb(null, null, null, null);  // 404
      history.unsubscribe(); // stop the syncing process of store with history
    } else {
      // success
      loadServerState({ renderProps, store, getLocals }, (error, initialState) => { // eslint-disable-line no-shadow, max-len
        history.unsubscribe(); // stop the syncing process of store with history
        if (error) {
          cb(error, null, null, null); // error
        } else {
          // Pick up current location from the history via synchronous history.listen
          history.listen((newLocation) => {
            const oldLocation = parsePath(url);
            if (oldLocation.pathname !== newLocation.pathname || oldLocation.search !== newLocation.search) { // eslint-disable-line max-len
              cb(null, newLocation, null, null); // location changed -> redirect to new location
            } else {
              const component = (
                <Provider store={store}>
                  <RouterContext {...renderProps} />
                </Provider>
              );
              cb(null, null, component, initialState);
            }
          })();
        }
      });
    }
  });
}
