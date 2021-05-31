import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { stringify } from 'qs';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { fakeAccountLogin } from '@/services/api';
import { idpLogin } from '@/services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);  //调用services中的方法
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        //判断是否有权限
        if(!response.data.right) {
          message.error("无权限访问");
        }
        reloadAuthorized();
        //将用户信息存储在localstorge里面
        let UserInfo = {
          empno:response.data.empno,
          name:response.data.name,
          department:response.data.department,
        };
        // console.log(response.data);
        localStorage.setItem('userInfo',JSON.stringify(UserInfo));
        localStorage.setItem("token",response.data.token);  //存储token到localstorge中

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('/#/') + 1);
            }
          } else {
            redirect = null;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.push("/#/home/home"));  //重定向到个人申报页面
      } else{
        message.error(response.tip);
      }
    },
    *idpLogin({ payload }, { call, put }) {
      const response = yield call(idpLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        //判断是否有权限
        if(!response.data.right) {
          message.error("无权限访问");
        }
        reloadAuthorized();
        //将用户信息存储在localstorge里面
        let UserInfo = {
          empno:response.data.empno,
          name:response.data.name,
          department:response.data.department,
        };
        // console.log(response.data);
        localStorage.setItem('userInfo',JSON.stringify(UserInfo));
        localStorage.setItem("token",response.data.token);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('/#/') + 1);
            }
          } else {
            redirect = null;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.push("/#/personal/apply"));
        // yield put(routerRedux.push("/personal/apply"));
      } else{
        message.error(response.tip);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();

      //清除localstorge
      localStorage.clear();
      // redirect
      if (window.location.pathname !== '/user/Login') {
        yield put(
          routerRedux.replace({
            pathname: '/user/Login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      if(payload.data) {
        setAuthority(payload.data.right);
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
