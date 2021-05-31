import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

@connect(({ common }) => ({
  users: common.users,
}))
export default class UserSelect extends Component{


  handleUserSearch = value => {  //搜索用户
    let flag = false;  //判断是否触发搜索
    if(value !== ''){
      if(value.startsWith("0")) {
        if(value.length > 3) {
          flag=true;
        }
      }else {
        flag=true;
      }
    }
    if(flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'common/getUserList',
        payload: {
          word: value
        },
      });
    }
  };

  render() {
    const { users,changeSelect } = this.props;
    const userOptions = users.map(d => <Option key={d.empNo}>{d.empNo}-{d.name}</Option>);

    return (
      <Select
        showSearch
        placeholder="请输入员工姓名或工号"
        showArrow={false}
        filterOption={false}
        onSearch={this.handleUserSearch}
        notFoundContent={null}
      >
        {userOptions}
      </Select>
    );
  }
}
