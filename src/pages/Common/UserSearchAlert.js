import React, { Component } from 'react';
import { Alert,Divider } from 'antd';

export default function UserSearchAlert() {
  return (
    <div style={{ marginBottom:48 }}>
      <Divider />
      <Alert message={
        <div>
          <h3>温馨提示：</h3>
          <p>1.输入员工姓名即可开始模糊匹配，例如：赵...；</p>
          <p>2.输入员工工号前4位即可开始模糊匹配，例如：0002...；</p>
        </div>
      } type="info" showIcon closable />
    </div>
  );
}
