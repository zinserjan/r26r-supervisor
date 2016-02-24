import { match } from 'react-router';
import loadClientState from './fetch/loadClientState';

export default function client({ store, initialState, routes, history, url, getLocals }, cb) {
  match({ routes, history, location: url }, () => {
    loadClientState({ store, initialState, routes, history, getLocals });

    cb();
  });
}
