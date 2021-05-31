// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/back/login': (req, res) => {
    const { password, userName, type } = req.body;
    res.send(
      {
        "code": 0,
        "tip": "登录成功",
        "data": {
          "id": 1,
          "name": "鬼主",
          "empno": "000000",
          "department": "信息技术管理部-技术开发室",
          "right": "USER",
          "token": "eyJhbGciOiJIUzI1NiJ9.eyJlbXBObyI6IjAxNjkwMiIsImV4cCI6MTU2Mzg1MjE3NiwiaWF0IjoxNTYzNzY1Nzc2LCJqdGkiOiIzMTMzIn0.GQVsdV5Nw-whgS_IC0U4VFzh0tDJQQB8KDOmevj8Dp0",
        }
      });
  },
};
