
export default function getLocals(renderProps, store, getCustomLocals) {
  const { location, params } = renderProps;
  const { dispatch, getState } = store;

  return (component, components) => {
    const customLocals = (typeof getCustomLocals === 'function') ? getCustomLocals(component, components) : {}; // eslint-disable-line max-len
    return {
      location,
      params,
      dispatch,
      getState,
      ...customLocals,
    };
  };
}
