import React, { Component } from 'react';
import { message } from 'antd';
import './Login.less';
import Login from "../../components/Login";
import DocumentTitle from 'react-document-title';
import { systemName } from '../../common/GenericVariable';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    handleLoginSubmit(userName, password) {
        //在此填写提交登录表单的方法
      const { dispatch } = this.props;
      //通过dva数据请求流程发起登录操作
      // dispatch({
      //   type:'',
      //   payload: ''
      // }).then(res => {
      //   message.info("登录成功");
      //   this.props.history.push('/home');
      // });

        this.props.history.push('#/home');
    }

    render() {
        return (
            <DocumentTitle title="登录">
                <Login title={ systemName } handleLoginSubmit={ this.handleLoginSubmit } />
            </DocumentTitle>
        );
    }
}

export default LoginPage;
