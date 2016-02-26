import { match } from 'react-router';
import loadClientState from './fetch/loadClientState';

export default function client({ store, initialState, routes, history, getLocals }, cb) {
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    loadClientState({ store, initialState, routes, history, getLocals });

    cb(error, redirectLocation, renderProps);
  });
}
