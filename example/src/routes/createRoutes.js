require('require-ensure-shim').shim(require);

import React from 'react';
import { Route, Redirect } from 'react-router';
import App from '../components/App';
import Counter from '../components/counter/Counter';

function onEnter(nextState, replaceState) {
  const { location } = nextState;

  if (!location.query.sort) {
    const newLocation = {
      pathname: location.pathname,
      state: location.state,
      query: {
        sort: 'asc',
      },
    };
    replaceState(newLocation);
  }
}

export default function createRoutes() {
  return (
    <Route path="/" component={App}>
      <Redirect from="counter-test" to="counter-query"/>
      <Route path="counter-query" component={Counter} onEnter={onEnter}/>
      <Route path="counter" component={Counter}/>
      <Route path="async" getComponent={function getComponent(location, cb) {
        require.ensure([], (require) => {
          if (typeof window === "undefined") {
            cb(null, require('../components/async/Async').default);
          } else {
            setTimeout(() => {
              cb(null, require('../components/async/Async').default);
            }, 1000);
          }
        });
      }}
      />
    </Route>
  );
}
