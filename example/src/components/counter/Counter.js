import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { increment as incrementAction, decrement as decrementAction } from '../../action/counter';

import styles from './counter.css';

function mapStateToProps(state) {
  return {
    count: state.counter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    increment: bindActionCreators(incrementAction, dispatch),
    decrement: bindActionCreators(decrementAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Counter extends Component {

  static propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func,
    decrement: PropTypes.func,
  };

  render() {
    const { count, increment, decrement } = this.props;
    return (
      <div className={styles.container}>
        <p>{count}</p>
        <button className={styles.increment} onClick={increment}>
          +1
        </button>
        <button className={styles.decrement} onClick={decrement}>
          -1
        </button>
      </div>
    );
  }
}
