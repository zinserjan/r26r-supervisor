import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { prefetch, fetch, defer } from 'r26r-supervisor';

import { push, replace, go, goBack, goForward } from 'react-router-redux';


let prefetchCalled = 0;
let fetchCalled = 0;

@prefetch(function prefetchData({ dispatch, getState, location }){

  //if (location.pathname !== '/counter'){
  //  dispatch(replace('/counter'));
  //}
  console.log(++prefetchCalled);
  return Promise.resolve();
})
@fetch(function fetchData({ dispatch, getState }){
  console.log(++fetchCalled);
  return Promise.resolve();
})
@defer(function fetchData({ dispatch, getState }){
  return Promise.resolve();
})
export default class App extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    return (
      <div>
        <h1>Demo</h1>
        <div>
          {children}
        </div>
        <div>
          <Link to="/">Go to Home</Link>
        </div>
        <div>
          <Link to="/counter">Go to Counter</Link>
        </div>
        <div>
          <Link to="/async">Go to Async</Link>
        </div>
        <div>
          <a href="/whoami">Server-only route</a>
        </div>
      </div>
    );
  }
}
