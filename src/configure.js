import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';

function createReducer(reducers = {}) {
  return combineReducers({
    ...reducers,
    routing: routerReducer,
  });
}

export default function configure(options = {}) {
  const { reducers = {}, middlewares = [], enhancers = [], initialState = {} } = options;
  let { history } = options;

  // create reducer from reducers
  const reducer = createReducer(reducers);

  // Sync dispatched route actions to the history
  const reduxSimpleRouterMiddleware = routerMiddleware(history);

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

  // monkey patch replaceReducer to apply new reducers
  const replaceReducer = store.replaceReducer;
  store.replaceReducer = function patchedReplaceReducer(newReducers = {}) {
    replaceReducer(createReducer(newReducers));
  };

  // Create an enhanced history that syncs navigation events with the store
  history = syncHistoryWithStore(history, store);

  return {
    store,
    history,
  };
}
