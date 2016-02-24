import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './counter.css';

function mapStateToProps(state) {
  return {
    count: state.counter,
  };
}


@connect(mapStateToProps)
export default class Counter extends Component {

  static propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func,
    decrement: PropTypes.func,
  };

  render() {
    const { loading, loadingError } = this.props;

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
