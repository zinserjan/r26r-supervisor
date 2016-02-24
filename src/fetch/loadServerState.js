import { PREFETCH, FETCH } from './type';
import createGetLocals from './getLocals';
import getDataDependencies from './getDataDependencies';

export default function ({ renderProps, store, getLocals }, cb) {
  const { getState } = store;
  const { components } = renderProps;
  const getAllLocals = createGetLocals(renderProps, store, getLocals);

  // fetch data
  return Promise
    .resolve()
    .then(() => getDataDependencies(PREFETCH, components, getAllLocals))
    .then(() => getDataDependencies(FETCH, components, getAllLocals))
    .then(() => {
      cb(null, getState());
    })
    .catch((error) => {
      cb(error, null);
    });
}
