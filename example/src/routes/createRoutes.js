require('require-ensure-shim').shim(require);

import React from 'react';
import { Route } from 'react-router';
import App from '../components/App';
import Counter from '../components/counter/Counter';

export default function createRoutes() {
  return (
    <Route path="/" component={App}>
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
