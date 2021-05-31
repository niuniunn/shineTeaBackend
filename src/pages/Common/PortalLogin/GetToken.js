import React, { Component } from 'react';
import { connect } from 'dva';
import { portalLogin } from "../../../defaultSettings";
import { reloadAuthorized } from "../../../utils/Authorized";
import { setAuthority } from "../../../utils/authority";

@connect(({ login }) => ({
  login,
}))
export default class GetCode extends Component{

componentDidMount() {
  const { dispatch } = this.props;

  let code = this.props.location.query.code;
    fetch(`${portalLogin.getTokenUrl}client_id=${portalLogin.client_id}&grant_type=authorization_code&code=${code}&client_secret=${portalLogin.client_secret}`,{ method:'POST' })
      .then(response => response.json()).then(function(res) {

        // //后端拉取用户信息
        // dispatch({
        //   type: 'login/idpLogin',
        //   payload: {
        //     token: res.access_token,
        //   },
        // });

      // //前端直接拉取用户信息
      fetch(`${portalLogin.getUserInfoUrl}client_id=${portalLogin.client_id}&access_token=${res.access_token}`,{ method:'get' })
        .then(response => response.json()).then(function(res) {
          // reloadAuthorized();
          setAuthority("USER");
        reloadAuthorized();
          //将用户信息存储在localstorge里面
          let UserInfo = {
            empno:res.loginName,
            name:res.displayName,
          };
          localStorage.setItem('userInfo',JSON.stringify(UserInfo));
          console.log(UserInfo);
          window.location.href = "/PcReact/#/home/index";  //跳转到主页：hash路由
        });

      })
  }

  render() {
    return (
      <div>
        自动获取信息中...
      </div>
    );
  }
}
