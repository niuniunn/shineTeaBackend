import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import styles from './Index.less';

@connect(({ }) => ({}))
export default class Index extends Component {
  render() {
    return (
      <Card>
        不要问我是谁，你只需知我很帅,掉渣的那种...  ——第一任前端组组长 邹江华（2019-2020）
      </Card>
    );
  }
}
