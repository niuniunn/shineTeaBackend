export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/user/login',  redirect: '/login' },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/login',
    // component: '../layouts/UserLayout',
    routes: [
      { path: '/login', redirect: '/login/getCode' },
      { path: '/login/getCode', component: './Common/PortalLogin/GetCode' },
      { path: '/login/getToken', component: './Common/PortalLogin/GetToken' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/shop/shop' },
      /*{
        path: '/board/board',
        icon: 'dashboard',
        name: 'board',   //通过国际化处理为中文，请移步src/locales/zh-CN/menu.js
        component: './Board/Board',
      },*/
      {
        path: '/shop/shop',
        icon: 'shop',
        name: 'shopManage',   //通过国际化处理为中文，请移步src/locales/zh-CN/menu.js
        component: './Shop/Shop',
      },
      {
        path: '/shop/newShop',
        icon: 'home',
        name: 'newShop',   //通过国际化处理为中文，请移步src/locales/zh-CN/menu.js
        hideInMenu:true,
        component: './Shop/NewShop',
      },
      {
        path: '/shop/shopDetail',
        icon: 'home',
        name: 'shopDetail',
        hideInMenu:true,
        component: './Shop/ShopDetail',
      },
      {
        path: '/category/category',
        icon: 'apartment',
        name: 'category',
        component: './Category/Category',
      },
      {
        path: '/goods/goodsList',
        icon: 'shopping',
        name: 'goodsList',
        component: './Goods/GoodsList',
      },
      {
        path: '/goods/newGoods',
        icon: 'home',
        name: 'newGoods',
        hideInMenu:true,
        component: './Goods/NewGoods',
      },
      {
        path: '/order/orderList',
        icon: 'snippets',
        name: 'orderList',
        component: './Order/OrderList',
      },
      {
        path: '/order/orderDetail',
        icon: 'home',
        name: 'orderDetail',
        hideInMenu:true,
        component: './Order/OrderDetail',
      },
      {
        path: '/member/memberList',
        icon: 'user',
        name: 'memberList',
        component: './Member/MemberList',
      },
      {
        path: '/coupon/newCoupon',
        icon: 'account-book',
        name: 'newCoupon',
        component: './Coupon/newCoupon',
      },
      {
        path: '/403',
        hideInMenu:true,
        name: 'not-permission',
        component: './Exception/403',
      },
      {
        path: '/404',
        hideInMenu:true,
        name: 'not-find',
        component: './Exception/404',
      },
      {
        path: '/500',
        hideInMenu:true,
        name: 'server-error',
        component: './Exception/500',
      },
      {
        component: '404',
      },
    ],
  },
];
