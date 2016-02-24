import propName from './propName';

function getHooks(component = {}) {
  if (component[propName]) {
    return { component, hooks: component[propName] };
  } else if (component.WrappedComponent) {
    return getHooks(component.WrappedComponent);
  }
  return null;
}

export default function getDataDependencies(type, components, getLocals) {
  return components
    // collect all components with their fetch hooks
    .map(getHooks)
    // filter out falsy components
    .filter((value) => value)
    // call fetch data methods sequentially and return single promise
    .reduce((promise, { component, hooks }) => promise.then(() => {
      const hook = hooks[type];

      if (typeof hook !== 'function') {
        return Promise.resolve();
      }

      return hook(getLocals(component, components));
    }), Promise.resolve());
}
