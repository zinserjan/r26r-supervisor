import { match } from 'react-router';
import loadClientState from './fetch/loadClientState';

export default function client(props, cb) {
  const { store, initialState, routes, history, getLocals } = props;
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      history.replace(redirectLocation);
      client(props, cb);
    } else if (renderProps) {
      const data = {
        store,
        initialState,
        routes,
        history,
        getLocals,
        redirectLocation,
        renderProps,
      };
      loadClientState(data, (err) => {
        cb(err, redirectLocation, renderProps);
      });
    } else {
      cb(error, redirectLocation, renderProps);
    }
  });
}
