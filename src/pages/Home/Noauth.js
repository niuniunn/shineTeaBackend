import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ }) => ({}))
export default class Noauth extends Component {
  render() {
    return (
      <div>哈哈哈哈，不用登录我也能看这个页面啦...</div>
    );
  }
}
