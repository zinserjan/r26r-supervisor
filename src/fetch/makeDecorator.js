import propName from './propName';

export default name => fetch => ComposedComponent => {
  if (ComposedComponent[propName]) {
    ComposedComponent[propName][name] = fetch; // eslint-disable-line no-param-reassign
  } else {
    ComposedComponent[propName] = {  // eslint-disable-line no-param-reassign
      [name]: fetch,
    };
  }

  return ComposedComponent;
};
