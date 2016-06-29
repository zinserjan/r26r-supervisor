/* eslint-disable max-len */
import { match } from 'react-router';
import { PREFETCH, FETCH, DEFER } from './type';
import createGetLocals from './getLocals';
import getDataDependencies from './getDataDependencies';
import isEmpty from 'lodash/isEmpty';

const shouldFetch = (oldLocation, newLocation) => !oldLocation && newLocation || oldLocation.pathname !== newLocation.pathname || oldLocation.search !== newLocation.search; // eslint-disable-line max-len

const log = (e) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(e); // eslint-disable-line no-console
  }
};

const resolveDataDependencies = (components, getAllLocals, renderProps, beforeResolve, afterResolve) =>
  Promise
    .resolve()
    .then(() => {
      if (typeof beforeResolve === 'function') {
        beforeResolve(renderProps);
      }
    })
    .catch(log)
    .then(() => getDataDependencies(PREFETCH, components, getAllLocals))
    .then(() => {
      // call fetch but doesn't wait for it
      getDataDependencies(FETCH, components, getAllLocals)
        .catch(log)
        .then(() => {
          if (typeof afterResolve === 'function') {
            afterResolve(renderProps);
          }
        })
        .catch(log);

      // call defer but doesn't wait for it
      getDataDependencies(DEFER, components, getAllLocals)
        .catch(log);

      return Promise.resolve();
    });


const registerHook = ({ history, routes, store, getLocals, location, beforeResolve, afterResolve }) => {
  let oldLocation = location;

  history.listenBefore((location, continueTransition) => { // eslint-disable-line no-shadow
    if (!shouldFetch(oldLocation, location)) {
      continueTransition();
      return;
    }
    oldLocation = location;

    match({ location, routes }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        history.transitionTo(redirectLocation);
      } else if (renderProps) {
        const { components } = renderProps;
        const getAllLocals = createGetLocals(renderProps, store, getLocals);

        resolveDataDependencies(components, getAllLocals, renderProps, beforeResolve, afterResolve)
          .then(continueTransition, continueTransition)
          .catch(log);
      } else {
        continueTransition();
      }
    });
  });
};


export default function ({ history, routes, store, getLocals, initialState = {}, renderProps, beforeResolve, afterResolve }, cb) { // eslint-disable-line max-len
  const hasInitialState = !isEmpty(initialState);

  // use synchronous listen to get current url -> changes with history v3
  history.listen((location) => {
    const hooksData = { history, routes, store, getLocals, location, beforeResolve, afterResolve };

    if (!hasInitialState) {
      const { components } = renderProps;
      const getAllLocals = createGetLocals(renderProps, store, getLocals);

      resolveDataDependencies(components, getAllLocals, renderProps, beforeResolve, afterResolve)
        .then(() => {
          registerHook(hooksData);
          cb();
        })
        .catch((err) => {
          registerHook(hooksData);
          cb(err);
        });
    } else {
      registerHook(hooksData);
      cb();
    }
  })();
}
