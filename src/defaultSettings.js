module.exports = {
  "navTheme": "light",  //网站的颜色模式，分light、dark两种，light为浅色背景，dark为深色背景
  "primaryColor": "#93c6b0",  //网站的基础颜色
  "layout": "sidemenu",  //布局方式，分sidemenu、topmenu两种
  "contentWidth": "Fluid",  //内容自适应，分Fluid、Fixed两种
  "fixedHeader": true,  //顶部导航固定
  "autoHideHeader": false,  //自动隐藏顶部导航
  "fixSiderbar": true,  //固定侧边栏
  "menu": {
    "disableLocal": false  //是否取消国际化:true（取消国际化）  false（启用国际化）
  },
  "title": "闲茶SHINETEA",
  "pwa": true,
  "iconfontUrl": "",
  "collapse": true,
  "systemName": "闲茶后台管理系统",   //系统名称
  "portalLogin": {  //门户单点登录配置
    "client_id": "react",  //权限系统client_id
    "client_secret": "5ad8fd8b66944820b84a90c52af412a4",  //权限系统client_secret
    "requestUrl": "http://login.sichuanair.com/idp/oauth2/authorize?",
    "getTokenUrl": "http://login.sichuanair.com/idp/oauth2/getToken?",
    "getUserInfoUrl": "https://login.sichuanair.com/idp/oauth2/getUserInfo?",  //根据token获取用户信息
    "logoutUrl": "http://login.sichuanair.com/idp/profile/OAUTH2/Redirect/GLO?",  //权限系统退出地址
    // "loginUrl": "http://xxxx.sichuanair.com:8080/%23/login",  //应用的登录地址：权限系统退出时使用
    //"loginUrl": "http://172.30.135.80:8080/PcReact/%23/login",
     "loginUrl": "http://localhost:8000/PcReact/%23/login",
    // "redirect_uri": "http://xxxx.sichuanair.com:8080/%23/login/getToken"  //重定向前端地址
    //"redirect_uri": "http://172.30.135.80:8080/PcReact/%23/login/getToken"
     "redirect_uri": "http://localhost:8000/PcReact/%23/login/getToken",
  },
  // "backEndUrl": "http://127.0.0.1:8080/",  //后台接口地址
  "backEndUrl": "http://82.157.175.93:8080/",  //后台接口地址
};
