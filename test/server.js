import { assert } from 'chai';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

describe('server', function () {

  class Test extends Component {
    render() {
      return (
        <div className="Test">
          <h1>Test</h1>
        </div>
      );
    }
  }

  it('works', function () {
    const string = renderToString(<Test />);

    assert.match(string, /Test/);
  });

});
