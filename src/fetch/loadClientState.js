import { match } from 'react-router';
import { PREFETCH, FETCH } from './type';
import createGetLocals from './getLocals';
import getDataDependencies from './getDataDependencies';

const shouldFetch = (oldLocation, newLocation) => !oldLocation && newLocation || oldLocation.pathname !== newLocation.pathname || oldLocation.search !== newLocation.search; // eslint-disable-line max-len

const log = (e) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(e);
  }
};

export default function ({ history, routes, store, getLocals }) {
  let oldLocation = null;

  const stopResolving = history.listenBefore((location, continueTransition) => {
    if (!shouldFetch(oldLocation, location)) return;
    oldLocation = location;

    match({ location, routes }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        history.transitionTo(redirectLocation); // todo replaceState?
      } else if (renderProps) {
        const { components } = renderProps;
        const getAllLocals = createGetLocals(renderProps, store, getLocals);

        Promise
          .resolve()
          .then(() => getDataDependencies(PREFETCH, components, getAllLocals))
          .then(() => {
            // call fetch but doesn't wait for it
            getDataDependencies(FETCH, components, getAllLocals)
              .catch(log)
          })
          .then(continueTransition, continueTransition)
          .catch(log)
      } else {
        continueTransition();
      }
    });
  });

  return stopResolving;
}
