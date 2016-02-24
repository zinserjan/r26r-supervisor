import { match } from 'react-router';
import { PREFETCH, FETCH } from './type';
import createGetLocals from './getLocals';
import getDataDependencies from './getDataDependencies';
import isEmpty from 'lodash/isEmpty';

const shouldFetch = (oldLocation, newLocation) => !oldLocation && newLocation || oldLocation.pathname !== newLocation.pathname || oldLocation.search !== newLocation.search; // eslint-disable-line max-len

const log = (e) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(e);
  }
};

export default function ({ history, routes, store, getLocals, initialState = {} }) {
  let oldLocation = null;
  let initialRender = true;
  const useState = !isEmpty(initialState);

  const stopResolving = history.listenBefore((location, continueTransition) => {
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

        // use initial state on first render when server rendered with state for the current url
        const useInitialState = initialRender && useState && !shouldFetch(initialState.routing.location, location); // eslint-disable-line max-len

        Promise
          .resolve()
          .then(() => {
            if (!useInitialState) {
              return getDataDependencies(PREFETCH, components, getAllLocals);
            }
            return Promise.resolve();
          })
          .then(() => {
            if (!useInitialState) {
              // call fetch but doesn't wait for it
              getDataDependencies(FETCH, components, getAllLocals)
                .catch(log);
            }
            return Promise.resolve();
          })
          .then(continueTransition, continueTransition)
          .catch(log);
      } else {
        continueTransition();
      }
      initialRender = false;
    });
  });

  return stopResolving;
}
