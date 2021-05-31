import React, { Component } from 'react';
import { portalLogin } from "../../../defaultSettings";

export default class GetCode extends Component{

  componentDidMount() {
    const {dispatch} = this.props;

    // fetch(`${portalLogin.requestUrl}redirect_uri=${portalLogin.redirect_uri}&state=${portalLogin.client_id}&client_id=${portalLogin.client_id}&response_type=code`);
    window.location.href=`${portalLogin.requestUrl}redirect_uri=${portalLogin.redirect_uri}&client_id=${portalLogin.client_id}&response_type=code`;

    // let a = document.createElement("a");         
    // a.href = `${portalLogin.requestUrl}redirect_uri=${portalLogin.redirect_uri}&state=${portalLogin.client_id}&client_id=${portalLogin.client_id}&response_type=code`;         
    // a.click();         

    // dispatch({
    //   type: 'Login/Login',
    //   payload: {
    //     ...values,
    //   },
    // });
    //对接权限系统
    // let url = `${portalLogin.requestUrl}redirect_uri=${portalLogin.redirect_uri}&state=${portalLogin.client_id}&client_id=${portalLogin.client_id}&response_type=code`;  //得到code
    // let client_code = '';
    // let getTokenUrl = `${portalLogin.requestUrl}getToken?client_id=${portalLogin.client_id}&grant_type=authorization_code&code=${client_code}&client_secret=${portalLogin.client_secret}`;   //得到token

  }

  render() {
    return (
      <div>
        自动登录中...
      </div>
    );
  }
}
