import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { syncHistory, routeReducer } from 'react-router-redux';

function createReducer(reducers = {}) {
  return combineReducers({
    ...reducers,
    routing: routeReducer,
  });
}

export function createStore(options = {}) {
  const { history, reducers = {}, middlewares = [], enhancers = [], initialState = {} } = options;

  // create reducer from reducers
  const reducer = createReducer(reducers);

  // Sync dispatched route actions to the history
  const reduxSimpleRouterMiddleware = syncHistory(history);

  // create middlewares
  const middleware = [
    reduxSimpleRouterMiddleware,
    ...middlewares,
  ];

  // apply middlewares & store enhancers to createStore
  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )(_createStore);

  // finally create the store
  const store = finalCreateStore(reducer, initialState);

  // store unsubscribe on store to stop the syncing process set up by listenForReplays.
  const { unsubscribe } = reduxSimpleRouterMiddleware;
  store._unsubscribe = unsubscribe;

  if (module.hot) {
    // for hot module reloading monkey patch replaceReducer to apply new reducers
    const replaceReducer = store.replaceReducer;
    store.replaceReducer = function patchedReplaceReducer(newReducers = {}) {
      replaceReducer(createReducer(newReducers));
    };
  }

  // Required for replaying actions from devtools
  reduxSimpleRouterMiddleware.listenForReplays(store);

  return store;
}
